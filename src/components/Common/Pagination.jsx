// src/components/Common/Pagination.jsx
import React from 'react';
import ReactPaginate from 'react-paginate';

export default function Pagination({
  pageCount,
  onPageChange,
  forcePage = null,
  className = '',
}) {
  return (
    <ReactPaginate
      previousLabel="← Previous"
      nextLabel="Next →"
      breakLabel="..."
      pageCount={pageCount}
      onPageChange={onPageChange}
      forcePage={forcePage}
      containerClassName={`flex justify-center items-center space-x-2 mt-4 ${className}`}
      pageClassName="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-100 rounded"
      activeClassName="bg-blue-600 text-white"
      previousClassName="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-100 rounded"
      nextClassName="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-100 rounded"
      disabledClassName="opacity-50 cursor-not-allowed"
      breakClassName="px-2 text-gray-400"
      marginPagesDisplayed={1}
      pageRangeDisplayed={3}
    />
  );
}