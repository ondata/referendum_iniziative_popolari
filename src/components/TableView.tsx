import React, { useState, useMemo, useEffect, useCallback } from 'react';
import type { Initiative } from '../types/initiative';
import { formatDate, formatNumber, isSigningActive, normalizeForSorting } from '../lib/initiatives';
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
      categoriesBase = categoriesBase.filter(initiative =>
        initiative.idDecTipoIniziativa?.nome === typeFilter
      );
    }
    if (statusFilter) {
      categoriesBase = categoriesBase.filter(initiative =>
        initiative.idDecStatoIniziativa?.nome === statusFilter
      );
    }

    // Per statuses: applica solo filtri tipo e categoria
    let statusesBase = [...baseInitiatives];
    if (typeFilter) {
      statusesBase = statusesBase.filter(initiative =>
        initiative.idDecTipoIniziativa?.nome === typeFilter
      );
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
        new Set(typesBase.map(i => i.idDecTipoIniziativa?.nome).filter(Boolean))
      ).sort()
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
      if (i.idDecTipoIniziativa?.nome) {
        typeSet.add(i.idDecTipoIniziativa.nome);
      }
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
        initiative.idDecTipoIniziativa?.nome === typeFilter;

      return matchesSearch && matchesCategory && matchesStatus && matchesType;
    });

    // Ordinamento
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortColumn) {
        case 'titolo':
          aValue = normalizeForSorting(a.titolo || '');
          bValue = normalizeForSorting(b.titolo || '');
          break;
        case 'tipologia':
          aValue = a.idDecTipoIniziativa?.nome || '';
          bValue = b.idDecTipoIniziativa?.nome || '';
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
          aValue = normalizeForSorting(a.titolo || '');
          bValue = normalizeForSorting(b.titolo || '');
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
        <svg className="w-4 h-4 text-civic-neutral opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }

    return sortDirection === 'asc' ? (
      <svg className="w-4 h-4 text-civic-terra" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={3} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-civic-terra" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={3} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  return (
    <div className="min-h-screen">
      {/* Header - Brutalist */}
      <header className="bg-civic-charcoal border-b-3 border-civic-terra sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <a href={normalizedBaseUrl || '/'} className="inline-flex items-center text-white hover:text-civic-terra font-bold uppercase text-sm tracking-wide transition-colors border-b-2 border-transparent hover:border-civic-terra pb-1">
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Iniziative
              </a>
            </div>
            <HamburgerMenuReact baseUrl={baseUrl} />
          </div>
        </div>
      </header>

      {/* Filtri e ricerca - Brutalist */}
      <div className="bg-civic-stone border-b-3 border-civic-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Sezione Filtri */}
          <div className="bg-white border-3 border-civic-border p-6 mb-4 relative">
            <div className="absolute top-0 right-0 w-20 h-20 border-r-3 border-t-3 border-civic-terra opacity-20"></div>
            <h3 className="font-serif text-2xl font-bold text-civic-charcoal mb-6 flex items-center relative z-10">
              Filtri
              <div className="ml-4 h-0.5 flex-1 bg-gradient-to-r from-civic-terra to-transparent"></div>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 relative z-10">
              {/* Barra di ricerca */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-civic-terra" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Cerca..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border-2 border-civic-border bg-white placeholder-civic-neutral text-civic-charcoal focus:outline-none focus:border-civic-terra font-medium transition-colors"
                />
              </div>

              {/* Filtro tipologia */}
              <div>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="block w-full px-3 py-2.5 border-2 border-civic-border bg-white text-civic-charcoal font-medium focus:outline-none focus:border-civic-terra transition-colors appearance-none bg-no-repeat bg-right pr-8"
                  style={{
                    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%232a2a2a'%3E%3Cpath stroke-linecap='square' stroke-linejoin='miter' stroke-width='3' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E\")",
                    backgroundSize: '1.5rem',
                    backgroundPosition: 'right 0.5rem center'
                  }}
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
                  className="block w-full px-3 py-2.5 border-2 border-civic-border bg-white text-civic-charcoal font-medium focus:outline-none focus:border-civic-terra transition-colors appearance-none bg-no-repeat bg-right pr-8"
                  style={{
                    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%232a2a2a'%3E%3Cpath stroke-linecap='square' stroke-linejoin='miter' stroke-width='3' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E\")",
                    backgroundSize: '1.5rem',
                    backgroundPosition: 'right 0.5rem center'
                  }}
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
                  className="block w-full px-3 py-2.5 border-2 border-civic-border bg-white text-civic-charcoal font-medium focus:outline-none focus:border-civic-terra transition-colors appearance-none bg-no-repeat bg-right pr-8"
                  style={{
                    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%232a2a2a'%3E%3Cpath stroke-linecap='square' stroke-linejoin='miter' stroke-width='3' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E\")",
                    backgroundSize: '1.5rem',
                    backgroundPosition: 'right 0.5rem center'
                  }}
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
                  className={`p-2.5 border-2 transition-all ${
                    hasActiveFilters
                      ? 'bg-civic-charcoal border-civic-border text-white hover:bg-civic-terra hover:border-civic-terra'
                      : 'bg-civic-stone border-civic-neutral text-civic-neutral cursor-not-allowed'
                  }`}
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Contatore risultati */}
          <div className="mb-4">
            <p className="text-civic-charcoal font-bold border-l-3 border-civic-terra pl-4 py-2">
              {filteredAndSortedInitiatives.length === initiatives.length ? (
                <>Totale: <span className="civic-number text-civic-terra">{initiatives.length}</span> iniziative</>
              ) : (
                <>
                  Visualizzazione di <span className="civic-number text-civic-terra">{filteredAndSortedInitiatives.length}</span> su <span className="civic-number">{initiatives.length}</span> iniziative
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Tabella */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Nota informativa */}
        <div className="mb-6 p-4 bg-civic-stone border-l-6 border-civic-terra border-3 border-civic-border">
          <p className="text-sm text-civic-charcoal">
            <span className="font-bold">Nota bene</span>: le firme visualizzate qui si riferiscono esclusivamente alle quelle raccolte online; il quorum finale si raggiunge sommando queste a quelle tradizionali.
          </p>
        </div>

        <div className="bg-white border-3 border-civic-border overflow-hidden">
          {filteredAndSortedInitiatives.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y-2 divide-civic-border">
                <thead className="bg-civic-charcoal">
                  <tr>
                    <th
                      onClick={() => handleSort('titolo')}
                      className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider cursor-pointer hover:bg-civic-terra select-none transition-colors border-r-2 border-civic-border"
                    >
                      <div className="flex items-center space-x-1">
                        <span>Titolo</span>
                        {getSortIcon('titolo')}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort('tipologia')}
                      className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider cursor-pointer hover:bg-civic-terra select-none transition-colors border-r-2 border-civic-border"
                    >
                      <div className="flex items-center space-x-1">
                        <span>Tipologia</span>
                        {getSortIcon('tipologia')}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort('categoria')}
                      className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider cursor-pointer hover:bg-civic-terra select-none transition-colors border-r-2 border-civic-border"
                    >
                      <div className="flex items-center space-x-1">
                        <span>Categoria</span>
                        {getSortIcon('categoria')}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort('stato')}
                      className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider cursor-pointer hover:bg-civic-terra select-none transition-colors border-r-2 border-civic-border"
                    >
                      <div className="flex items-center space-x-1">
                        <span>Stato</span>
                        {getSortIcon('stato')}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort('sostenitori')}
                      className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider cursor-pointer hover:bg-civic-terra select-none transition-colors border-r-2 border-civic-border"
                    >
                      <div className="flex items-center space-x-1">
                        <span>Sostenitori</span>
                        {getSortIcon('sostenitori')}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort('quorum')}
                      className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider cursor-pointer hover:bg-civic-terra select-none transition-colors border-r-2 border-civic-border"
                    >
                      <div className="flex items-center space-x-1">
                        <span>Quorum</span>
                        {getSortIcon('quorum')}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort('dataApertura')}
                      className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider cursor-pointer hover:bg-civic-terra select-none transition-colors"
                    >
                      <div className="flex items-center space-x-1">
                        <span>Data Apertura</span>
                        {getSortIcon('dataApertura')}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y-2 divide-civic-border">
                  {filteredAndSortedInitiatives.map((initiative) => (
                    <tr key={initiative.id} className="hover:bg-civic-stone transition-colors">
                      <td className="px-6 py-4 border-r-2 border-civic-stone">
                        <a
                          href={`${normalizedBaseUrl}/initiative/${initiative.id}`}
                          className="text-civic-terra hover:text-civic-terra-dark font-bold border-b-2 border-transparent hover:border-civic-terra transition-all"
                        >
                          {initiative.titolo}
                        </a>
                      </td>
                      <td className="px-6 py-4 text-sm text-civic-charcoal font-medium border-r-2 border-civic-stone">
                        {initiative.idDecTipoIniziativa?.nome || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-civic-charcoal font-medium border-r-2 border-civic-stone">
                        {initiative.idDecCatIniziativa?.nome || 'N/A'}
                      </td>
                      <td className="px-6 py-4 border-r-2 border-civic-stone">
                        <span className={`civic-badge text-xs ${
                          initiative.idDecStatoIniziativa?.nome === 'IN RACCOLTA FIRME'
                            ? 'bg-civic-success text-white'
                            : initiative.idDecStatoIniziativa?.nome === 'CHIUSA'
                            ? 'bg-civic-neutral text-white'
                            : 'bg-civic-stone text-civic-charcoal border-civic-neutral'
                        }`}>
                          {initiative.idDecStatoIniziativa?.nome || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-civic-charcoal font-bold text-right civic-number border-r-2 border-civic-stone">
                        {formatNumber(initiative.sostenitori)}
                      </td>
                      <td className="px-6 py-4 text-sm text-civic-charcoal font-bold text-right civic-number border-r-2 border-civic-stone">
                        {formatNumber(initiative.quorum)}
                      </td>
                      <td className="px-6 py-4 text-sm text-civic-charcoal font-medium civic-number">
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
            <div className="text-center py-16 px-4 bg-civic-stone">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 mx-auto mb-6 border-3 border-civic-neutral flex items-center justify-center">
                  <svg className="w-10 h-10 text-civic-neutral" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="font-serif text-xl font-bold text-civic-charcoal mb-6">
                  Nessuna iniziativa trovata
                </p>
                <p className="text-sm text-civic-neutral mb-8">
                  Prova a modificare i filtri di ricerca per vedere più risultati.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-3 bg-civic-charcoal border-3 border-civic-border text-white font-bold uppercase text-sm tracking-wide hover:bg-civic-terra hover:border-civic-terra transition-all inline-flex items-center"
                >
                  <XMarkIcon className="w-5 h-5 mr-2" />
                  Rimuovi filtri
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
