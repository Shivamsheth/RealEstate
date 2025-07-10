// src/components/Property/Gallery.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaArrowRight, FaTimes } from 'react-icons/fa';

export default function Gallery({ images = [] }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const openModal = (idx) => {
    setCurrentIdx(idx);
    setIsOpen(true);
  };
  const closeModal = () => setIsOpen(false);

  const showPrev = (e) => {
    e.stopPropagation();
    setCurrentIdx((i) => (i === 0 ? images.length - 1 : i - 1));
  };
  const showNext = (e) => {
    e.stopPropagation();
    setCurrentIdx((i) => (i === images.length - 1 ? 0 : i + 1));
  };

  if (!images.length) {
    return (
      <div className="text-center text-gray-400 py-8">
        No images available.
      </div>
    );
  }

  return (
    <>
      {/* Thumbnail Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {images.map((src, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05 }}
            className="overflow-hidden rounded-lg cursor-pointer"
            onClick={() => openModal(idx)}
          >
            <img
              src={src}
              alt={`Property image ${idx + 1}`}
              className="w-full h-32 sm:h-40 md:h-48 object-cover transition-transform"
              loading="lazy"
            />
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-3xl w-full mx-4"
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-gray-100 p-2 rounded hover:bg-gray-700"
              >
                <FaTimes size={20} />
              </button>

              {/* Prev Arrow */}
              <button
                onClick={showPrev}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-100 p-2 rounded hover:bg-gray-700"
              >
                <FaArrowLeft size={24} />
              </button>

              {/* Image */}
              <img
                src={images[currentIdx]}
                alt={`Slide ${currentIdx + 1}`}
                className="w-full max-h-[80vh] object-contain rounded-lg"
              />

              {/* Next Arrow */}
              <button
                onClick={showNext}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-100 p-2 rounded hover:bg-gray-700"
              >
                <FaArrowRight size={24} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}