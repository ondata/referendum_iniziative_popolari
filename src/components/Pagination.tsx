import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Genera array di numeri di pagina da mostrare
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <div className="flex items-center justify-between bg-white px-4 py-3 border-3 border-civic-border">
      <div className="flex flex-1 justify-between sm:hidden">
        {/* Mobile */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label={`Vai alla pagina precedente (pagina ${currentPage - 1})`}
          className="relative inline-flex items-center px-4 py-2 text-sm font-bold uppercase tracking-wide text-civic-charcoal bg-white border-2 border-civic-border hover:bg-civic-stone transition-colors active:translate-y-px disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Precedente
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label={`Vai alla pagina successiva (pagina ${currentPage + 1})`}
          className="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-bold uppercase tracking-wide text-civic-charcoal bg-white border-2 border-civic-border hover:bg-civic-stone transition-colors active:translate-y-px disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Successiva
        </button>
      </div>

      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-civic-neutral">
            Visualizzazione di <span className="civic-number text-civic-charcoal">{startItem}</span> - <span className="civic-number text-civic-charcoal">{endItem}</span> di{' '}
            <span className="civic-number text-civic-charcoal">{totalItems}</span> risultati
          </p>
        </div>

        <div>
          <nav className="relative z-0 inline-flex -space-x-px" aria-label="Pagination">
            {/* Precedente */}
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label={`Pagina precedente (pagina ${currentPage - 1})`}
              className="relative inline-flex items-center px-2 py-2 border-2 border-civic-border bg-white text-sm font-medium text-civic-charcoal hover:bg-civic-stone transition-colors active:translate-y-px disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Precedente</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>

            {/* Numeri di pagina */}
            {getPageNumbers().map((page, index) => {
              if (page === '...') {
                return (
                  <span
                    key={`dots-${index}`}
                    className="relative inline-flex items-center px-4 py-2 border-2 border-civic-border bg-white text-sm font-medium text-civic-neutral"
                  >
                    ...
                  </span>
                );
              }

              const pageNumber = page as number;
              const isCurrentPage = pageNumber === currentPage;

              return (
                <button
                  key={pageNumber}
                  onClick={() => onPageChange(pageNumber)}
                  aria-label={`Pagina ${pageNumber}${isCurrentPage ? ' (pagina corrente)' : ''}`}
                  aria-current={isCurrentPage ? 'page' : undefined}
                  className={`relative inline-flex items-center px-4 py-2 border-2 text-sm font-bold civic-number transition-colors active:translate-y-px ${
                    isCurrentPage
                      ? 'z-10 bg-civic-terra border-civic-terra text-white'
                      : 'bg-white border-civic-border text-civic-charcoal hover:bg-civic-stone'
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}

            {/* Successiva */}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label={`Pagina successiva (pagina ${currentPage + 1})`}
              className="relative inline-flex items-center px-2 py-2 border-2 border-civic-border bg-white text-sm font-medium text-civic-charcoal hover:bg-civic-stone transition-colors active:translate-y-px disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Successiva</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
