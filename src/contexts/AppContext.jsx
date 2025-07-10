// src/contexts/AppContext.jsx
import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Global search query
  const [searchQuery, setSearchQuery] = useState('');

  // Global filters for properties
  const [filters, setFilters] = useState({
    price: { min: 0, max: 10000000 },
    area:  { min: 0, max: 5000 },
    sizes: [],      // e.g. ["1","2","3"]
  });

  // Whether the filter drawer/panel is open
  const [isFilterOpen, setFilterOpen] = useState(false);

  const toggleFilter = () => setFilterOpen(open => !open);

  const value = {
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    isFilterOpen,
    toggleFilter,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook for consuming context
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within AppProvider');
  }
  return ctx;
}