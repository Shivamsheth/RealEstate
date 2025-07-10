// src/pages/Home.jsx
import React, { useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { useFirestoreCollection } from '../hooks/useFirestoreCollection';
import usePagination from '../hooks/usePagination';
import PropertyCard from '../components/Property/PropertyCard';
import PropertyFilter from '../components/Property/PropertyFilter';
import Pagination from '../components/Common/Pagination';
import { motion, AnimatePresence } from 'framer-motion';
import Spinner from '../components/Common/Spinner';

export default function Home() {
  const {
    searchQuery,
    filters,
    setFilters,
    isFilterOpen,
    toggleFilter,
  } = useApp();

  const { data: properties, loading } =
    useFirestoreCollection('properties');

  // apply search and filter criteria
  const filtered = useMemo(() => {
    return properties.filter((p) => {
      const titleMatch = p.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const inPrice =
        p.price >= filters.price.min && p.price <= filters.price.max;
      const inArea =
        p.area >= filters.area.min && p.area <= filters.area.max;
      const sizeMatch =
        !filters.sizes.length ||
        filters.sizes.map((s) => parseInt(s)).includes(p.size);
      return titleMatch && inPrice && inArea && sizeMatch;
    });
  }, [properties, searchQuery, filters]);

  const {
    currentItems,
    pageCount,
    handlePageClick,
  } = usePagination(filtered, 12);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex bg-gray-900 text-gray-100 min-h-screen pt-16">
      {/* Filter drawer */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="fixed z-40 inset-y-0 left-0 bg-gray-800 p-4 shadow-lg"
          >
            <PropertyFilter onFilter={setFilters} />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold">Properties</h1>
          <button
            onClick={toggleFilter}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded"
          >
            Filters
          </button>
        </div>

        {currentItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentItems.map((prop) => (
              <PropertyCard key={prop.id} {...prop} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 py-12">
            No properties found.
          </p>
        )}

        {pageCount > 1 && (
          <Pagination
            pageCount={pageCount}
            onPageChange={handlePageClick}
          />
        )}
      </main>
    </div>
  );
}