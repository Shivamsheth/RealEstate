// src/pages/PropertyDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { motion } from 'framer-motion';
import Spinner from '../components/Common/Spinner';
import Gallery from '../components/Property/Gallery';
import Scheduler from '../components/Appointment/Scheduler';

export default function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const ref = doc(db, 'properties', id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setProperty({ id: snap.id, ...snap.data() });
        }
      } catch (err) {
        console.error('Error loading property:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <Spinner />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-gray-400">
        Property not found.
      </div>
    );
  }

  const {
    title,
    price,
    area,
    size,
    description,
    images = [],
    status,
    address,
    agentId,
    agentName
  } = property;

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen pt-16">
      {/* Gallery */}
      <section className="container mx-auto px-4 py-6">
        <Gallery images={images} />
      </section>

      {/* Details & Scheduler */}
      <section className="container mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Property Info */}
        <motion.div
          className="lg:col-span-2 bg-gray-800 p-6 rounded-lg shadow-md space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-semibold">{title}</h1>
          <p className="text-gray-400">{address}</p>

          <div className="flex flex-wrap gap-6 mt-4">
            <div>
              <span className="text-gray-400 text-sm">Price</span>
              <p className="text-xl font-medium">₹{price.toLocaleString()}</p>
            </div>
            <div>
              <span className="text-gray-400 text-sm">Area</span>
              <p className="text-xl font-medium">{area} sqft</p>
            </div>
            <div>
              <span className="text-gray-400 text-sm">Size</span>
              <p className="text-xl font-medium">{size} BHK</p>
            </div>
            <div>
              <span className="text-gray-400 text-sm">Status</span>
              <p className="text-xl font-medium capitalize">{status}</p>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-2">Description</h2>
            <p className="text-gray-300 leading-relaxed">
              {description || 'No description available.'}
            </p>
          </div>
        </motion.div>

        {/* Appointment Scheduler */}
        <div
          id="schedule"
          className="bg-gray-800 p-6 rounded-lg shadow-md"
        >
          <Scheduler
            propertyId={id}
            propertyTitle={title}
            agentId={agentId}
            agentName={agentName}
          />
        </div>
      </section>
    </div>
  );
}