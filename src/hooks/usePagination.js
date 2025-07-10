// src/hooks/usePagination.js
import { useState, useMemo } from 'react';

export default function usePagination(items = [], itemsPerPage = 10) {
  const [currentPage, setCurrentPage] = useState(0);

  const pageCount = Math.ceil(items.length / itemsPerPage);

  const currentItems = useMemo(() => {
    const start = currentPage * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  }, [items, currentPage, itemsPerPage]);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  return { currentItems, pageCount, handlePageClick };
}