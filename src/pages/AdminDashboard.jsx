// src/pages/AdminDashboard.jsx
import React, { useMemo } from 'react';
import Spinner from '../components/Common/Spinner';
import { useFirestoreCollection } from '../hooks/useFirestoreCollection';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

export default function AdminDashboard() {
  const { data: users, loading: usersLoading } = useFirestoreCollection('users');
  const { data: properties, loading: propsLoading } = useFirestoreCollection('properties');
  const { data: appointments, loading: apptsLoading } = useFirestoreCollection('appointments');
  const { data: promotions, loading: promosLoading } = useFirestoreCollection('promotions');

  const loading = usersLoading || propsLoading || apptsLoading || promosLoading;

  const statusCounts = useMemo(() => {
    const counts = { available: 0, booked: 0, offer: 0, sold: 0, other: 0 };
    properties.forEach(({ status = 'other' }) => {
      const key = status.toLowerCase();
      counts[key] = (counts[key] ?? counts.other) + 1;
    });
    return counts;
  }, [properties]);

  const chartData = useMemo(() => ({
    labels: ['Available', 'Booked', 'Offer', 'Sold', 'Other'],
    datasets: [
      {
        label: 'Properties',
        backgroundColor: ['#16a34a', '#eab308', '#3b82f6', '#dc2626', '#6b7280'],
        data: [
          statusCounts.available,
          statusCounts.booked,
          statusCounts.offer,
          statusCounts.sold,
          statusCounts.other,
        ],
      },
    ],
  }), [statusCounts]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-semibold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-4 bg-gray-800 rounded-lg shadow">
          <h2 className="text-sm text-gray-400">Total Users</h2>
          <p className="mt-2 text-2xl font-bold">{users.length}</p>
        </div>

        <div className="p-4 bg-gray-800 rounded-lg shadow">
          <h2 className="text-sm text-gray-400">Total Properties</h2>
          <p className="mt-2 text-2xl font-bold">{properties.length}</p>
        </div>

        <div className="p-4 bg-gray-800 rounded-lg shadow">
          <h2 className="text-sm text-gray-400">Appointments</h2>
          <p className="mt-2 text-2xl font-bold">{appointments.length}</p>
        </div>

        <div className="p-4 bg-gray-800 rounded-lg shadow">
          <h2 className="text-sm text-gray-400">Promotions</h2>
          <p className="mt-2 text-2xl font-bold">{promotions.length}</p>
        </div>
      </div>

      <div className="p-6 bg-gray-800 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Property Status Overview</h2>
        <Bar data={chartData} />
      </div>
    </div>
  );
}