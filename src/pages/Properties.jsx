// src/pages/Properties.jsx
import React, { useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { useFirestoreCollection } from '../hooks/useFirestoreCollection';
import usePagination from '../hooks/usePagination';
import PropertyCard from '../components/Property/PropertyCard';
import PropertyFilter from '../components/Property/PropertyFilter';
import Pagination from '../components/Common/Pagination';
import { motion, AnimatePresence } from 'framer-motion';
import Spinner from '../components/Common/Spinner';

export default function Properties() {
  const {
    searchQuery,
    setSearchQuery,
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
      const matchesSearch = p.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const inPrice =
        p.price >= filters.price.min && p.price <= filters.price.max;
      const inArea =
        p.area >= filters.area.min && p.area <= filters.area.max;
      const sizeMatch =
        !filters.sizes.length ||
        filters.sizes.map((s) => parseInt(s)).includes(p.size);
      return matchesSearch && inPrice && inArea && sizeMatch;
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
      {/* Filter Drawer */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="fixed inset-y-0 left-0 z-40 bg-gray-800 p-4 shadow-lg"
          >
            <PropertyFilter onFilter={setFilters} />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
          <h1 className="text-3xl font-semibold">All Properties</h1>
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by title…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 sm:flex-none px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={toggleFilter}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-gray-100"
            >
              Filters
            </button>
          </div>
        </div>

        {currentItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentItems.map((prop) => (
              <PropertyCard key={prop.id} {...prop} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 py-12">
            No properties match your criteria.
          </p>
        )}

        {pageCount > 1 && (
          <Pagination
            pageCount={pageCount}
            onPageChange={handlePageClick}
            className="mt-8"
          />
        )}
      </main>
    </div>
  );
}