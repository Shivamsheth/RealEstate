// src/components/Property/PropertyCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import StatusTag from './StatusTag';

export default function PropertyCard({
  id,
  title,
  price,
  area,
  size,
  mainImage,
  status
}) {
  return (
    <motion.div
      layout
      whileHover={{ scale: 1.02 }}
      className="bg-gray-800 text-gray-100 rounded-lg shadow-md overflow-hidden"
    >
      <div className="relative h-48">
        <img
          src={mainImage}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute top-2 right-2">
          <StatusTag status={status} />
        </div>
      </div>

      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold truncate">{title}</h3>
        <div className="text-sm text-gray-400">
          Price: <span className="text-blue-400 font-medium">₹{price.toLocaleString()}</span>
        </div>
        <div className="text-sm">
          Area: <span className="font-medium">{area} sqft</span>
        </div>
        <div className="text-sm">
          Size: <span className="font-medium">{size} BHK</span>
        </div>

        <div className="mt-4 flex space-x-2">
          <Link
            to={`/properties/${id}`}
            className="flex-grow text-center py-2 bg-blue-600 hover:bg-blue-500 rounded text-sm font-medium"
          >
            Details
          </Link>
          <Link
            to={`/properties/${id}#schedule`}
            className="flex-grow text-center py-2 bg-green-600 hover:bg-green-500 rounded text-sm font-medium"
          >
            Schedule
          </Link>
        </div>
      </div>
    </motion.div>
  );
}