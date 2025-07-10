// src/components/Appointment/Scheduler.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../services/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc
} from 'firebase/firestore';
import { motion } from 'framer-motion';
import { confirmAlert } from '../../services/alertService';
import Spinner from '../Common/Spinner';

export default function Scheduler({
  propertyId,
  propertyTitle,
  agentId,
  agentName
}) {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState('');
  const [existingAppointments, setExistingAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [availableTimes, setAvailableTimes] = useState([]);

  // Fetch appointments for chosen date
  useEffect(() => {
    if (!selectedDate) return;
    const fetchAppointments = async () => {
      setLoading(true);
      const apptRef = collection(db, 'appointments');
      const q = query(apptRef, where('date', '==', selectedDate));
      const snap = await getDocs(q);
      const appts = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setExistingAppointments(appts);
      setLoading(false);
    };
    fetchAppointments();
  }, [selectedDate]);

  // Compute available slots and enforce constraints
  useEffect(() => {
    if (!selectedDate) return;
    const totalCount = existingAppointments.length;
    const agentCount = existingAppointments.filter(
      a => a.agentId === agentId
    ).length;

    // If limits reached, clear slots
    if (totalCount >= 7 || agentCount >= 3) {
      setAvailableTimes([]);
      return;
    }

    // Hourly slots from 09:00 to 17:00
    const slots = [];
    for (let h = 9; h <= 17; h++) {
      const time = `${String(h).padStart(2, '0')}:00`;
      if (!existingAppointments.some(a => a.time === time)) {
        slots.push(time);
      }
    }
    setAvailableTimes(slots);
  }, [existingAppointments, agentId, selectedDate]);

  const handleDateChange = e => {
    setSelectedDate(e.target.value); // "YYYY-MM-DD"
    setExistingAppointments([]);
    setAvailableTimes([]);
  };

  const handleBooking = async time => {
    const { isConfirmed } = await confirmAlert({
      title: 'Confirm Appointment',
      text: `Book on ${selectedDate} at ${time}?`,
      icon: 'question',
      showCancelButton: true
    });
    if (!isConfirmed) return;

    // Write to Firestore
    await addDoc(collection(db, 'appointments'), {
      propertyId,
      propertyTitle,
      agentId,
      agentName,
      clientId: user.uid,
      clientName: user.email,
      date: selectedDate,
      time,
      timestamp: Date.now()
    });

    await confirmAlert({
      title: 'Booked!',
      text: 'Your appointment is confirmed.',
      icon: 'success'
    });

    // Optimistically update appointments
    setExistingAppointments(prev => [
      ...prev,
      { agentId, date: selectedDate, time }
    ]);
  };

  return (
    <div className="p-6 bg-gray-800 text-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Schedule a Visit</h2>

      <label className="block mb-2">
        Choose Date:
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          className="mt-1 block w-full p-2 bg-gray-700 rounded border border-gray-600"
        />
      </label>

      {!selectedDate && (
        <p className="text-gray-400 mt-4">
          Please select a date to see available time slots.
        </p>
      )}

      {selectedDate && loading && (
        <div className="flex justify-center my-6">
          <Spinner />
        </div>
      )}

      {selectedDate && !loading && (
        <>
          {availableTimes.length === 0 ? (
            <p className="text-red-400 mt-4">
              No slots available (max 7/day or 3/agent reached).
            </p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
              {availableTimes.map(time => (
                <motion.button
                  key={time}
                  onClick={() => handleBooking(time)}
                  whileHover={{ scale: 1.05 }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded"
                >
                  {time}
                </motion.button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}