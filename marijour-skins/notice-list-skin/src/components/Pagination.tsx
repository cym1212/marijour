import React from 'react';
import { PaginationProps } from '../types';

const ChevronLeft: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M10 12L6 8L10 4" />
  </svg>
);

const ChevronRight: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M6 12L10 8L6 4" />
  </svg>
);

const DoubleChevronLeft: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M11 12L7 8L11 4M7 12L3 8L7 4" />
  </svg>
);

const DoubleChevronRight: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M5 12L9 8L5 4M9 12L13 8L9 4" />
  </svg>
);

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 5
}) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: number[] = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);
    
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className="pagination" aria-label="페이지 네비게이션">
      <button
        className="pagination-button"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        aria-label="첫 페이지"
      >
        <DoubleChevronLeft />
      </button>
      
      <button
        className="pagination-button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="이전 페이지"
      >
        <ChevronLeft />
      </button>
      
      <div className="pagination-numbers">
        {pageNumbers[0] > 1 && (
          <>
            <button
              className="pagination-number"
              onClick={() => onPageChange(1)}
            >
              1
            </button>
            {pageNumbers[0] > 2 && <span className="pagination-ellipsis">...</span>}
          </>
        )}
        
        {pageNumbers.map(page => (
          <button
            key={page}
            className={`pagination-number ${currentPage === page ? 'active' : ''}`}
            onClick={() => onPageChange(page)}
            aria-current={currentPage === page ? 'page' : undefined}
          >
            {page}
          </button>
        ))}
        
        {pageNumbers[pageNumbers.length - 1] < totalPages && (
          <>
            {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
              <span className="pagination-ellipsis">...</span>
            )}
            <button
              className="pagination-number"
              onClick={() => onPageChange(totalPages)}
            >
              {totalPages}
            </button>
          </>
        )}
      </div>
      
      <button
        className="pagination-button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="다음 페이지"
      >
        <ChevronRight />
      </button>
      
      <button
        className="pagination-button"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        aria-label="마지막 페이지"
      >
        <DoubleChevronRight />
      </button>
    </nav>
  );
};