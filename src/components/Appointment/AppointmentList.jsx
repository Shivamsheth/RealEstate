// src/components/Appointment/AppointmentList.jsx
import React, { useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useFirestoreCollection } from '../../hooks/useFirestoreCollection';
import usePagination from '../../hooks/usePagination';
import ReactPaginate from 'react-paginate';
import { motion } from 'framer-motion';
import { confirmAlert } from '../../services/alertService';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../services/firebase';

export default function AppointmentList() {
  const { user } = useAuth();
  const userId = user?.uid;
  const role = user?.role;

  // fetch appointments relevant to this user
  const { data: allAppointments, loading } = useFirestoreCollection(
    'appointments',
    role === 'agent'
      ? [{ field: 'agentId', operator: '==', value: userId }]
      : [{ field: 'clientId', operator: '==', value: userId }]
  );

  // sort by date descending
  const sortedAppointments = useMemo(() => {
    return [...allAppointments].sort((a, b) => b.timestamp - a.timestamp);
  }, [allAppointments]);

  // pagination: 5 items per page
  const {
    currentItems,
    pageCount,
    handlePageClick,
  } = usePagination(sortedAppointments, 5);

  // cancel appointment handler
  const handleCancel = async (apptId) => {
    const confirmed = await confirmAlert({
      title: 'Cancel Appointment?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
    });
    if (!confirmed) return;
    await deleteDoc(doc(db, 'appointments', apptId));
    await confirmAlert({
      title: 'Cancelled!',
      text: 'Your appointment has been removed.',
      icon: 'success',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="text-gray-400">Loading appointments...</span>
      </div>
    );
  }

  if (sortedAppointments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No appointments found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {currentItems.map((appt) => (
        <motion.div
          key={appt.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between bg-gray-800 text-gray-100 p-4 rounded-lg shadow-sm"
        >
          <div>
            <div className="font-semibold">{appt.propertyTitle}</div>
            <div className="text-sm text-gray-400">
              {new Date(appt.timestamp).toLocaleString()}
            </div>
            <div className="text-sm">
              With:{' '}
              <span className="font-medium">
                {role === 'agent' ? appt.clientName : appt.agentName}
              </span>
            </div>
          </div>
          <button
            onClick={() => handleCancel(appt.id)}
            className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
          >
            Cancel
          </button>
        </motion.div>
      ))}

      {pageCount > 1 && (
        <ReactPaginate
          previousLabel={'← Previous'}
          nextLabel={'Next →'}
          pageCount={pageCount}
          onPageChange={handlePageClick}
          containerClassName="flex justify-center space-x-2 mt-4"
          pageClassName="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded"
          activeClassName="bg-blue-600 text-white"
          previousClassName="px-3 py-1"
          nextClassName="px-3 py-1"
          disabledClassName="opacity-50 cursor-not-allowed"
        />
      )}
    </div>
  );
}