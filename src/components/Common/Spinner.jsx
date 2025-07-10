// src/components/Common/Spinner.jsx
import React from 'react';

export default function Spinner({ className = '' }) {
  return (
    <div
      className={`w-8 h-8 border-4 border-t-4 border-gray-600 border-t-blue-500 rounded-full animate-spin ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}