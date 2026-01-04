import { useState, useCallback, useEffect } from 'react';
import type { Initiative } from '../types/initiative';
import InitiativeCard from './InitiativeCard';
import SearchAndFilters from './SearchAndFilters';
import Pagination from './Pagination';
import { homeContent } from '../config/content';

const ITEMS_PER_PAGE = 12;

interface HomePageProps {
  initiatives: Initiative[];
  baseUrl?: string;
  hideHeader?: boolean;
}

export default function HomePage({ initiatives: allInitiatives, baseUrl = '/', hideHeader = false }: HomePageProps) {
  const [filteredInitiatives, setFilteredInitiatives] = useState<Initiative[]>(allInitiatives);
  const [currentPage, setCurrentPage] = useState(1);
  const [isInitialized, setIsInitialized] = useState(false);

  // Leggi la pagina dall'URL al caricamento
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const page = parseInt(urlParams.get('page') || '1', 10);
      setCurrentPage(Math.max(1, page));
      setIsInitialized(true);
    }
  }, []);

  // Aggiorna l'URL quando cambia la pagina
  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (currentPage > 1) {
        urlParams.set('page', currentPage.toString());
      } else {
        urlParams.delete('page');
      }
      const newURL = urlParams.toString() ? `${window.location.pathname}?${urlParams.toString()}` : window.location.pathname;
      window.history.replaceState({}, '', newURL);
    }
  }, [currentPage, isInitialized]);

  const handleFilter = useCallback((filtered: Initiative[]) => {
    setFilteredInitiatives(filtered);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentInitiatives = filteredInitiatives.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredInitiatives.length / ITEMS_PER_PAGE);

  return (
    <>
      {/* Header - condizionale */}
      {!hideHeader && (
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Navigation */}
            <div className="flex justify-end items-center mb-4">
              <div id="hamburger-menu-placeholder" data-base-url={baseUrl}></div>
            </div>

            {/* Title */}
            <div className="text-center">
              <a href={baseUrl} className="inline-block hover:text-blue-600 transition-colors">
                <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl cursor-pointer">
                  {homeContent.title}
                </h1>
              </a>
              <p className="mt-2 text-lg text-gray-600">
                {homeContent.subtitle}
              </p>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtri e ricerca */}
        <SearchAndFilters
          initiatives={allInitiatives}
          onFilter={handleFilter}
        />

        {/* Statistiche */}
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredInitiatives.length === allInitiatives.length ? (
              <>Totale: <span className="font-semibold">{allInitiatives.length}</span> iniziative</>
            ) : (
              <>
                Visualizzazione di <span className="font-semibold">{filteredInitiatives.length}</span> su <span className="font-semibold">{allInitiatives.length}</span> iniziative
              </>
            )}
          </p>
        </div>

        {/* Griglia delle card */}
        {currentInitiatives.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {currentInitiatives.map((initiative) => (
                <InitiativeCard key={initiative.id} initiative={initiative} />
              ))}
            </div>

            {/* Paginazione */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredInitiatives.length}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">
              Nessuna iniziativa trovata con i filtri applicati.
            </p>
            <button
              onClick={() => {
                setFilteredInitiatives(allInitiatives);
                setCurrentPage(1);
              }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Rimuovi filtri
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <div id="footer-placeholder"></div>
    </>
  );
}
