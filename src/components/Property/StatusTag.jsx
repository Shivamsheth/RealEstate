// src/components/Property/StatusTag.jsx
import React from 'react';

const STATUS_STYLES = {
  available: 'bg-green-600 text-white',
  booked:    'bg-yellow-500 text-white',
  offer:     'bg-blue-500 text-white',
  sold:      'bg-red-600 text-white',
};

export default function StatusTag({ status = 'available' }) {
  const style = STATUS_STYLES[status.toLowerCase()] || 'bg-gray-500 text-white';
  return (
    <span
      className={`px-2 py-1 text-xs font-semibold uppercase rounded ${style}`}
    >
      {status}
    </span>
  );
}