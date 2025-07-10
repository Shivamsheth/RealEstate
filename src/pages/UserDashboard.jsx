// src/pages/UserDashboard.jsx
import React, { useMemo } from 'react';
import Sidebar from '../components/Common/Sidebar';
import Spinner from '../components/Common/Spinner';
import { useAuth } from '../contexts/AuthContext';
import { useFirestoreCollection } from '../hooks/useFirestoreCollection';
import { where } from 'firebase/firestore';

export default function UserDashboard() {
  const { user } = useAuth();
  const userId = user.uid;

  // fetch only this user's appointments
  const { data: appointments, loading } = useFirestoreCollection(
    'appointments',
    [ where('clientId', '==', userId) ]
  );

  const now = Date.now();
  const total = appointments.length;
  const upcoming = appointments.filter(a => a.timestamp >= now).length;
  const past = total - upcoming;

  // sort and slice lists
  const upcomingList = useMemo(
    () =>
      appointments
        .filter(a => a.timestamp >= now)
        .sort((a, b) => a.timestamp - b.timestamp),
    [appointments]
  );

  const pastList = useMemo(
    () =>
      appointments
        .filter(a => a.timestamp < now)
        .sort((a, b) => b.timestamp - a.timestamp),
    [appointments]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex bg-gray-900 text-gray-100 min-h-screen">
      <Sidebar />

      <main className="flex-1 p-6 space-y-6">
        <h1 className="text-3xl font-semibold">My Dashboard</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-4 bg-gray-800 rounded-lg shadow">
            <h2 className="text-sm text-gray-400">Total Appointments</h2>
            <p className="mt-2 text-2xl font-bold">{total}</p>
          </div>
          <div className="p-4 bg-gray-800 rounded-lg shadow">
            <h2 className="text-sm text-gray-400">Upcoming</h2>
            <p className="mt-2 text-2xl font-bold">{upcoming}</p>
          </div>
          <div className="p-4 bg-gray-800 rounded-lg shadow">
            <h2 className="text-sm text-gray-400">Past</h2>
            <p className="mt-2 text-2xl font-bold">{past}</p>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="p-6 bg-gray-800 rounded-lg shadow space-y-4">
          <h2 className="text-xl font-semibold">Upcoming Appointments</h2>
          {upcomingList.length === 0 && (
            <p className="text-gray-400 text-center">No upcoming appointments.</p>
          )}
          {upcomingList.map(appt => (
            <div
              key={appt.id}
              className="flex justify-between items-center py-2 border-b border-gray-700 last:border-0"
            >
              <div>
                <p className="font-medium">{appt.propertyTitle}</p>
                <p className="text-sm text-gray-400">
                  {new Date(appt.timestamp).toLocaleString()}
                </p>
                <p className="text-sm">
                  Agent: <span className="font-medium">{appt.agentName}</span>
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Past Appointments */}
        <div className="p-6 bg-gray-800 rounded-lg shadow space-y-4">
          <h2 className="text-xl font-semibold">Past Appointments</h2>
          {pastList.length === 0 && (
            <p className="text-gray-400 text-center">No past appointments.</p>
          )}
          {pastList.map(appt => (
            <div
              key={appt.id}
              className="flex justify-between items-center py-2 border-b border-gray-700 last:border-0"
            >
              <div>
                <p className="font-medium">{appt.propertyTitle}</p>
                <p className="text-sm text-gray-400">
                  {new Date(appt.timestamp).toLocaleString()}
                </p>
                <p className="text-sm">
                  Agent: <span className="font-medium">{appt.agentName}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}