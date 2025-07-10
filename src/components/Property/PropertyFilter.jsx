// src/components/Property/PropertyFilter.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const SIZE_OPTIONS = ['1', '2', '3', '4', '5+'];

export default function PropertyFilter({ onFilter }) {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000000);
  const [minArea, setMinArea] = useState(0);
  const [maxArea, setMaxArea] = useState(5000);
  const [sizes, setSizes] = useState(new Set());

  // Debounce filter updates
  useEffect(() => {
    const id = setTimeout(() => {
      onFilter({
        price: { min: minPrice, max: maxPrice },
        area: { min: minArea, max: maxArea },
        sizes: Array.from(sizes),
      });
    }, 300);
    return () => clearTimeout(id);
  }, [minPrice, maxPrice, minArea, maxArea, sizes, onFilter]);

  const toggleSize = (size) => {
    setSizes((prev) => {
      const next = new Set(prev);
      next.has(size) ? next.delete(size) : next.add(size);
      return next;
    });
  };

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      exit={{ x: -300 }}
      className="w-64 bg-gray-800 text-gray-100 p-4 rounded shadow-lg"
    >
      <h3 className="text-xl font-semibold mb-4">Filters</h3>

      {/* Price Filter */}
      <div className="mb-6">
        <label className="block text-gray-300 mb-1">Price (₹)</label>
        <div className="flex space-x-2">
          <input
            type="number"
            min="0"
            value={minPrice}
            onChange={(e) => setMinPrice(+e.target.value)}
            className="w-1/2 p-2 bg-gray-700 border border-gray-600 rounded text-gray-100"
            placeholder="Min"
          />
          <input
            type="number"
            min="0"
            value={maxPrice}
            onChange={(e) => setMaxPrice(+e.target.value)}
            className="w-1/2 p-2 bg-gray-700 border border-gray-600 rounded text-gray-100"
            placeholder="Max"
          />
        </div>
      </div>

      {/* Area Filter */}
      <div className="mb-6">
        <label className="block text-gray-300 mb-1">Area (sqft)</label>
        <div className="flex space-x-2">
          <input
            type="number"
            min="0"
            value={minArea}
            onChange={(e) => setMinArea(+e.target.value)}
            className="w-1/2 p-2 bg-gray-700 border border-gray-600 rounded text-gray-100"
            placeholder="Min"
          />
          <input
            type="number"
            min="0"
            value={maxArea}
            onChange={(e) => setMaxArea(+e.target.value)}
            className="w-1/2 p-2 bg-gray-700 border border-gray-600 rounded text-gray-100"
            placeholder="Max"
          />
        </div>
      </div>

      {/* Size Filter */}
      <div className="mb-6">
        <span className="block text-gray-300 mb-2">Bedrooms</span>
        <div className="grid grid-cols-2 gap-2">
          {SIZE_OPTIONS.map((sz) => (
            <button
              key={sz}
              onClick={() => toggleSize(sz)}
              className={`px-3 py-1 rounded text-sm border ${
                sizes.has(sz)
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600'
              }`}
            >
              {sz} BHK
            </button>
          ))}
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={() => {
          setMinPrice(0);
          setMaxPrice(10000000);
          setMinArea(0);
          setMaxArea(5000);
          setSizes(new Set());
        }}
        className="w-full mt-4 py-2 bg-red-600 hover:bg-red-500 rounded text-gray-100 text-center"
      >
        Clear Filters
      </button>
    </motion.aside>
  );
}