// src/pages/AgentDashboard.jsx
import React, { useMemo } from 'react';
import Sidebar from '../components/Common/Sidebar';
import Spinner from '../components/Common/Spinner';
import { useAuth } from '../contexts/AuthContext';
import { useFirestoreCollection } from '../hooks/useFirestoreCollection';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

export default function AgentDashboard() {
  const { user } = useAuth();
  const userId = user.uid;

  // fetch only this agent's appointments
  const { data: appointments, loading } = useFirestoreCollection(
    'appointments',
    [{ field: 'agentId', operator: '==', value: userId }]
  );

  // current timestamp
  const now = Date.now();

  // summary counts
  const total = appointments.length;
  const upcoming = appointments.filter(a => a.timestamp >= now).length;
  const past = total - upcoming;

  // prepare next 7 days labels and counts
  const next7 = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + i);
    return d;
  });

  const labels = next7.map(d => d.toLocaleDateString());
  const dayCounts = next7.map(day =>
    appointments.filter(
      a =>
        new Date(a.timestamp).toLocaleDateString() ===
        day.toLocaleDateString()
    ).length
  );

  const chartData = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: 'Appointments',
          backgroundColor: '#3b82f6',
          data: dayCounts,
        },
      ],
    }),
    [labels, dayCounts]
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
        <h1 className="text-3xl font-semibold">Agent Dashboard</h1>

        {/* Summary cards */}
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

        {/* Chart for next 7 days */}
        <div className="p-6 bg-gray-800 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            Appointments This Week
          </h2>
          <Bar data={chartData} />
        </div>

        {/* Upcoming appointments list */}
        <div className="p-6 bg-gray-800 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Next Appointments</h2>
          {appointments
            .filter(a => a.timestamp >= now)
            .sort((a, b) => a.timestamp - b.timestamp)
            .slice(0, 5)
            .map(appt => (
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
                    Client: <span className="font-medium">{appt.clientName}</span>
                  </p>
                </div>
              </div>
            ))}
          {appointments.filter(a => a.timestamp >= now).length === 0 && (
            <p className="text-gray-400 text-center py-4">
              No upcoming appointments.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}