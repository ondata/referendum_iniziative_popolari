import React, { useState, useMemo, useEffect, useCallback } from 'react';
import type { Initiative } from '../types/initiative';
import { formatDate, formatNumber, isSigningActive } from '../lib/initiatives';
import { normalizeBaseUrl } from '../lib/paths';
import HamburgerMenuReact from './HamburgerMenuReact';
import { ArrowLeftIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface TableViewProps {
  initiatives: Initiative[];
  baseUrl: string;
}

type SortColumn = 'titolo' | 'tipologia' | 'categoria' | 'stato' | 'sostenitori' | 'quorum' | 'dataApertura';
type SortDirection = 'asc' | 'desc';

export default function TableView({ initiatives, baseUrl }: TableViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  // Normalizza il baseUrl per gestire correttamente dev e produzione
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl);
  const [sortColumn, setSortColumn] = useState<SortColumn>('dataApertura');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [isInitialized, setIsInitialized] = useState(false);

  // Funzione per aggiornare l'URL con i parametri attuali
  const updateURL = useCallback((params: {
    search?: string;
    categoria?: string;
    stato?: string;
    tipo?: string;
    ordinamento?: string;
    direzione?: string;
  }) => {
    if (typeof window === 'undefined') return;

    const urlParams = new URLSearchParams(window.location.search);

    // Aggiorna o rimuovi i parametri
    if (params.search) {
      urlParams.set('search', params.search);
    } else {
      urlParams.delete('search');
    }

    if (params.categoria) {
      urlParams.set('categoria', params.categoria);
    } else {
      urlParams.delete('categoria');
    }

    if (params.stato) {
      urlParams.set('stato', params.stato);
    } else {
      urlParams.delete('stato');
    }

    if (params.tipo) {
      urlParams.set('tipo', params.tipo);
    } else {
      urlParams.delete('tipo');
    }

    if (params.ordinamento && params.ordinamento !== 'dataApertura') {
      urlParams.set('ordinamento', params.ordinamento);
    } else {
      urlParams.delete('ordinamento');
    }

    if (params.direzione && params.direzione !== 'desc') {
      urlParams.set('direzione', params.direzione);
    } else {
      urlParams.delete('direzione');
    }

    // Aggiorna l'URL senza ricaricare la pagina
    const newURL = urlParams.toString() ? `${window.location.pathname}?${urlParams.toString()}` : window.location.pathname;
    window.history.replaceState({}, '', newURL);
  }, []);

  // Funzione per leggere i parametri dall'URL
  const readFromURL = useCallback(() => {
    if (typeof window === 'undefined') return;

    const urlParams = new URLSearchParams(window.location.search);
    const search = urlParams.get('search') || '';
    const categoria = urlParams.get('categoria') || '';
    const stato = urlParams.get('stato') || '';
    const tipo = urlParams.get('tipo') || '';
    const ordinamento = urlParams.get('ordinamento') || 'dataApertura';
    const direzione = urlParams.get('direzione') || 'desc';

    setSearchTerm(search);
    setCategoryFilter(categoria);
    setStatusFilter(stato);
    setTypeFilter(tipo);
    setSortColumn(ordinamento as SortColumn);
    setSortDirection(direzione as SortDirection);
    setIsInitialized(true);
  }, []);

  // Inizializza i filtri dall'URL al primo caricamento
  useEffect(() => {
    readFromURL();
  }, [readFromURL]);

  // Funzione per cancellare tutti i filtri
  const clearAllFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setStatusFilter('');
    setTypeFilter('');
    setSortColumn('dataApertura');
    setSortDirection('desc');

    // Pulisci anche l'URL
    if (typeof window !== 'undefined') {
      window.history.replaceState({}, '', window.location.pathname);
    }
  };

  // Controlla se ci sono filtri attivi
  const hasActiveFilters = searchTerm || categoryFilter || statusFilter || typeFilter || sortColumn !== 'dataApertura' || sortDirection !== 'desc';

  // Aggiorna l'URL quando cambiano i filtri (solo dopo l'inizializzazione)
  useEffect(() => {
    if (isInitialized) {
      updateURL({
        search: searchTerm,
        categoria: categoryFilter,
        stato: statusFilter,
        tipo: typeFilter,
        ordinamento: sortColumn,
        direzione: sortDirection
      });
    }
  }, [searchTerm, categoryFilter, statusFilter, typeFilter, sortColumn, sortDirection, isInitialized, updateURL]);

  // Calcola le opzioni disponibili basandosi sui filtri attivi
  const getAvailableOptions = useCallback(() => {
    let baseInitiatives = [...initiatives];

    // Applica filtro di ricerca per tutti i dropdown
    if (searchTerm) {
      baseInitiatives = baseInitiatives.filter(initiative =>
        initiative.titolo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        initiative.descrizioneBreve?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Per categories: applica solo filtri tipo e stato
    let categoriesBase = [...baseInitiatives];
    if (typeFilter) {
      categoriesBase = categoriesBase.filter(initiative => {
        if (typeFilter === 'Legge di iniziativa popolare') {
          return initiative.idDecTipoIniziativa?.id === 4;
        }
        if (typeFilter === 'Referendum abrogativo') {
          return initiative.idDecTipoIniziativa?.id === 1;
        }
        return false;
      });
    }
    if (statusFilter) {
      categoriesBase = categoriesBase.filter(initiative =>
        initiative.idDecStatoIniziativa?.nome === statusFilter
      );
    }

    // Per statuses: applica solo filtri tipo e categoria
    let statusesBase = [...baseInitiatives];
    if (typeFilter) {
      statusesBase = statusesBase.filter(initiative => {
        if (typeFilter === 'Legge di iniziativa popolare') {
          return initiative.idDecTipoIniziativa?.id === 4;
        }
        if (typeFilter === 'Referendum abrogativo') {
          return initiative.idDecTipoIniziativa?.id === 1;
        }
        return false;
      });
    }
    if (categoryFilter) {
      statusesBase = statusesBase.filter(initiative =>
        initiative.idDecCatIniziativa?.nome === categoryFilter
      );
    }

    // Per types: applica solo filtri categoria e stato
    let typesBase = [...baseInitiatives];
    if (categoryFilter) {
      typesBase = typesBase.filter(initiative =>
        initiative.idDecCatIniziativa?.nome === categoryFilter
      );
    }
    if (statusFilter) {
      typesBase = typesBase.filter(initiative =>
        initiative.idDecStatoIniziativa?.nome === statusFilter
      );
    }

    return {
      categories: Array.from(
        new Set(categoriesBase.map(i => i.idDecCatIniziativa?.nome).filter(Boolean))
      ).sort(),
      statuses: Array.from(
        new Set(statusesBase.map(i => i.idDecStatoIniziativa?.nome).filter(Boolean))
      ).sort(),
      types: Array.from(
        new Set(
          typesBase
            .map(i => {
              if (i.idDecTipoIniziativa?.id === 4) return 'Legge di iniziativa popolare';
              if (i.idDecTipoIniziativa?.id === 1) return 'Referendum abrogativo';
              return null;
            })
            .filter((type) => type !== null)
        )
      ).sort() as string[]
    };
  }, [initiatives, searchTerm, categoryFilter, statusFilter, typeFilter]);

  const availableOptions = getAvailableOptions();

  // Ottieni categorie e stati unici per i filtri (versione legacy, sostituita da availableOptions)
  const categories = useMemo(() => {
    const cats = [...new Set(initiatives.map(i => i.idDecCatIniziativa?.nome).filter(Boolean))];
    return cats.sort();
  }, [initiatives]);

  const statuses = useMemo(() => {
    const stats = [...new Set(initiatives.map(i => i.idDecStatoIniziativa?.nome).filter(Boolean))];
    return stats.sort();
  }, [initiatives]);

  const types = useMemo(() => {
    const typeSet = new Set<string>();
    initiatives.forEach(i => {
      if (i.idDecTipoIniziativa?.id === 4) typeSet.add('Legge di iniziativa popolare');
      if (i.idDecTipoIniziativa?.id === 1) typeSet.add('Referendum abrogativo');
    });
    return Array.from(typeSet).sort();
  }, [initiatives]);

  // Filtra e ordina le iniziative
  const filteredAndSortedInitiatives = useMemo(() => {
    let filtered = initiatives.filter(initiative => {
      const matchesSearch = !searchTerm ||
        initiative.titolo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        initiative.descrizioneBreve?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = !categoryFilter ||
        initiative.idDecCatIniziativa?.nome === categoryFilter;

      const matchesStatus = !statusFilter ||
        initiative.idDecStatoIniziativa?.nome === statusFilter;

      const matchesType = !typeFilter ||
        (typeFilter === 'Legge di iniziativa popolare' && initiative.idDecTipoIniziativa?.id === 4) ||
        (typeFilter === 'Referendum abrogativo' && initiative.idDecTipoIniziativa?.id === 1);

      return matchesSearch && matchesCategory && matchesStatus && matchesType;
    });

    // Ordinamento
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortColumn) {
        case 'titolo':
          aValue = a.titolo || '';
          bValue = b.titolo || '';
          break;
        case 'tipologia':
          aValue = (() => {
            if (a.idDecTipoIniziativa?.id === 4) return 'Legge di iniziativa popolare';
            if (a.idDecTipoIniziativa?.id === 1) return 'Referendum abrogativo';
            return '';
          })();
          bValue = (() => {
            if (b.idDecTipoIniziativa?.id === 4) return 'Legge di iniziativa popolare';
            if (b.idDecTipoIniziativa?.id === 1) return 'Referendum abrogativo';
            return '';
          })();
          break;
        case 'categoria':
          aValue = a.idDecCatIniziativa?.nome || '';
          bValue = b.idDecCatIniziativa?.nome || '';
          break;
        case 'stato':
          aValue = a.idDecStatoIniziativa?.nome || '';
          bValue = b.idDecStatoIniziativa?.nome || '';
          break;
        case 'sostenitori':
          aValue = a.sostenitori || 0;
          bValue = b.sostenitori || 0;
          break;
        case 'quorum':
          aValue = a.quorum || 0;
          bValue = b.quorum || 0;
          break;
        case 'dataApertura':
          aValue = new Date(a.dataApertura || 0).getTime();
          bValue = new Date(b.dataApertura || 0).getTime();
          break;
        default:
          aValue = a.titolo || '';
          bValue = b.titolo || '';
      }

      if (sortColumn === 'sostenitori' || sortColumn === 'dataApertura' || sortColumn === 'quorum') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      } else {
        const comparison = aValue.toString().localeCompare(bValue.toString(), 'it-IT');
        return sortDirection === 'asc' ? comparison : -comparison;
      }
    });

    return filtered;
  }, [initiatives, searchTerm, categoryFilter, statusFilter, typeFilter, sortColumn, sortDirection]);

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (column: SortColumn) => {
    if (sortColumn !== column) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }

    return sortDirection === 'asc' ? (
      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <a href={normalizedBaseUrl || '/'} className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium">
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Torna alle iniziative
              </a>
            </div>
            <HamburgerMenuReact baseUrl={baseUrl} />
          </div>
        </div>
      </header>

      {/* Filtri e ricerca */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Sezione Filtri */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Filtri</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Barra di ricerca */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Cerca iniziative..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Filtro tipologia */}
              <div>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Tutte le tipologie</option>
                  {availableOptions.types.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro stato */}
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Tutti gli stati</option>
                  {availableOptions.statuses.map(status => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro categoria */}
              <div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Tutte le categorie</option>
                  {availableOptions.categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Pulsante Cancella filtri */}
              <div className="flex items-center justify-end">
                <button
                  onClick={clearAllFilters}
                  disabled={!hasActiveFilters}
                  title="Rimuovi filtri"
                  className={`p-2 rounded-md transition-colors ${
                    hasActiveFilters
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                      : 'bg-gray-50 text-gray-400 border border-gray-200 cursor-not-allowed'
                  }`}
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Contatore risultati */}
          <div className="mb-4">
            <p className="text-gray-600">
              {filteredAndSortedInitiatives.length === initiatives.length ? (
                <>Totale: <span className="font-semibold">{initiatives.length}</span> iniziative</>
              ) : (
                <>
                  Visualizzazione di <span className="font-semibold">{filteredAndSortedInitiatives.length}</span> su <span className="font-semibold">{initiatives.length}</span> iniziative
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Tabella */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Nota informativa */}
        <div className="mb-6 p-4 bg-gray-50 border-l-4 border-blue-500 rounded-r-lg">
          <p className="text-sm text-gray-600">
            <span className="font-bold">Nota bene</span>: le firme visualizzate qui si riferiscono esclusivamente alle quelle raccolte online; il quorum finale si raggiunge sommando queste a quelle tradizionali.
          </p>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          {filteredAndSortedInitiatives.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      onClick={() => handleSort('titolo')}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                    >
                      <div className="flex items-center space-x-1">
                        <span>Titolo</span>
                        {getSortIcon('titolo')}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort('tipologia')}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                    >
                      <div className="flex items-center space-x-1">
                        <span>Tipologia</span>
                        {getSortIcon('tipologia')}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort('categoria')}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                    >
                      <div className="flex items-center space-x-1">
                        <span>Categoria</span>
                        {getSortIcon('categoria')}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort('stato')}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                    >
                      <div className="flex items-center space-x-1">
                        <span>Stato</span>
                        {getSortIcon('stato')}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort('sostenitori')}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                    >
                      <div className="flex items-center space-x-1">
                        <span>Sostenitori</span>
                        {getSortIcon('sostenitori')}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort('quorum')}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                    >
                      <div className="flex items-center space-x-1">
                        <span>Quorum</span>
                        {getSortIcon('quorum')}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort('dataApertura')}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                    >
                      <div className="flex items-center space-x-1">
                        <span>Data Apertura</span>
                        {getSortIcon('dataApertura')}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAndSortedInitiatives.map((initiative) => (
                    <tr key={initiative.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <a
                          href={`${normalizedBaseUrl}/initiative/${initiative.id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          {initiative.titolo}
                        </a>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {(() => {
                          if (initiative.idDecTipoIniziativa?.id === 4) return 'Legge di iniziativa popolare';
                          if (initiative.idDecTipoIniziativa?.id === 1) return 'Referendum abrogativo';
                          return 'N/A';
                        })()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {initiative.idDecCatIniziativa?.nome || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-sm ${
                          initiative.idDecStatoIniziativa?.nome === 'IN RACCOLTA FIRME'
                            ? 'bg-green-100 text-green-800'
                            : initiative.idDecStatoIniziativa?.nome === 'CHIUSA'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {initiative.idDecStatoIniziativa?.nome || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 text-right">
                        {formatNumber(initiative.sostenitori)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 text-right">
                        {formatNumber(initiative.quorum)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {initiative.dataApertura
                          ? new Date(initiative.dataApertura).toISOString().split('T')[0]
                          : 'N/A'
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">
                Nessuna iniziativa trovata con i filtri applicati.
              </p>
              <button
                onClick={clearAllFilters}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Rimuovi filtri
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
