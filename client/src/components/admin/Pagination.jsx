import { ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));

const getPageNumbers = (current, total) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = [];
  const leftSibling = Math.max(current - 1, 1);
  const rightSibling = Math.min(current + 1, total);
  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < total - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftCount = 3;
    for (let i = 1; i <= leftCount; i++) pages.push(i);
    pages.push('...');
    pages.push(total);
  } else if (showLeftEllipsis && !showRightEllipsis) {
    pages.push(1);
    pages.push('...');
    for (let i = total - 2; i <= total; i++) pages.push(i);
  } else if (showLeftEllipsis && showRightEllipsis) {
    pages.push(1);
    pages.push('...');
    for (let i = leftSibling; i <= rightSibling; i++) pages.push(i);
    pages.push('...');
    pages.push(total);
  } else {
    for (let i = 1; i <= total; i++) pages.push(i);
  }

  return pages;
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1 py-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className={cn(
          "flex items-center gap-1 px-2.5 sm:px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500",
          currentPage === 1
            ? "text-gray-300 cursor-not-allowed"
            : "text-gray-600 hover:bg-pink-50 hover:text-pink-700 active:scale-95"
        )}
      >
        <ChevronLeft size={16} />
        <span className="hidden sm:inline">Previous</span>
      </button>

      <div className="flex items-center gap-1">
        {pages.map((page, idx) =>
          page === '...' ? (
            <span
              key={`ellipsis-${idx}`}
              className="px-2 py-2 text-sm text-gray-400 select-none"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              aria-current={page === currentPage ? 'page' : undefined}
              aria-label={`Page ${page}`}
              className={cn(
                "min-w-[36px] h-9 rounded-xl text-sm font-medium transition-all duration-200",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500 active:scale-95",
                page === currentPage
                  ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-md shadow-pink-300/40"
                  : "text-gray-600 hover:bg-pink-50 hover:text-pink-700"
              )}
            >
              {page}
            </button>
          )
        )}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className={cn(
          "flex items-center gap-1 px-2.5 sm:px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500",
          currentPage === totalPages
            ? "text-gray-300 cursor-not-allowed"
            : "text-gray-600 hover:bg-pink-50 hover:text-pink-700 active:scale-95"
        )}
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight size={16} />
      </button>
    </nav>
  );
};

export default Pagination;
