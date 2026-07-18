import React from 'react'

export default function Pagination({
  page,
  limit,
  total,
  totalPages,
  onPageChange,
  onLimitChange
}) {
  const start = total === 0 ? 0 : (page - 1) * limit + 1
  const end = Math.min(page * limit, total)

  // Generate page numbers to show
  const getPages = () => {
    const pages = []
    const range = 1 // number of pages to show on either side of current page
    
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= page - range && i <= page + range)
      ) {
        pages.push(i)
      } else if (
        pages[pages.length - 1] !== '...'
      ) {
        pages.push('...')
      }
    }
    return pages
  }

  const pages = getPages()

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-card-alt border-t border-border mt-1">
      {/* Rows per page & showing text */}
      <div className="flex flex-wrap items-center gap-6 text-sm text-dim">
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="px-2.5 py-1 rounded bg-surface border border-neutral-300 dark:border-neutral-700 text-on-surface cursor-pointer text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition-all duration-200"
          >
            {[10, 25, 50, 100].map((opt) => (
              <option key={opt} value={opt} className="bg-surface">
                {opt}
              </option>
            ))}
          </select>
        </div>
        <div>
          Showing <span className="font-semibold text-bright">{start}</span> to{' '}
          <span className="font-semibold text-bright">{end}</span> of{' '}
          <span className="font-semibold text-bright">{total}</span> entries
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-1.5">
        {/* First Page */}
        <button
          disabled={page === 1}
          onClick={() => onPageChange(1)}
          className="inline-flex items-center justify-center w-8 h-8 rounded border border-neutral-300 dark:border-neutral-700 bg-surface text-on-surface text-sm transition-all duration-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          aria-label="First page"
        >
          «
        </button>

        {/* Previous Page */}
        <button
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="inline-flex items-center justify-center w-8 h-8 rounded border border-neutral-300 dark:border-neutral-700 bg-surface text-on-surface text-sm transition-all duration-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          aria-label="Previous page"
        >
          ‹
        </button>

        {/* Page Numbers */}
        {pages.map((p, idx) => {
          if (p === '...') {
            return (
              <span key={`ellipsis-${idx}`} className="px-1 text-dim text-sm select-none">
                ...
              </span>
            )
          }
          const isCurrent = p === page
          return (
            <button
              key={`page-${p}`}
              onClick={() => onPageChange(p)}
              className={`inline-flex items-center justify-center w-8 h-8 rounded text-sm font-semibold transition-all duration-200 cursor-pointer ${
                isCurrent
                  ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white shadow-md border-transparent'
                  : 'border border-neutral-300 dark:border-neutral-700 bg-surface text-on-surface hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              {p}
            </button>
          )
        })}

        {/* Next Page */}
        <button
          disabled={page === totalPages || totalPages === 0}
          onClick={() => onPageChange(page + 1)}
          className="inline-flex items-center justify-center w-8 h-8 rounded border border-neutral-300 dark:border-neutral-700 bg-surface text-on-surface text-sm transition-all duration-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          aria-label="Next page"
        >
          ›
        </button>

        {/* Last Page */}
        <button
          disabled={page === totalPages || totalPages === 0}
          onClick={() => onPageChange(totalPages)}
          className="inline-flex items-center justify-center w-8 h-8 rounded border border-neutral-300 dark:border-neutral-700 bg-surface text-on-surface text-sm transition-all duration-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          aria-label="Last page"
        >
          »
        </button>
      </div>
    </div>
  )
}
