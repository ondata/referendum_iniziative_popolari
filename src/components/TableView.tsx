import { useState, useMemo } from 'react';
import type { Initiative } from '../types/initiative';
import { formatNumber } from '../lib/initiatives';
import HamburgerMenu from './HamburgerMenu';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

interface TableViewProps {
  initiatives: Initiative[];
  baseUrl: string;
}

type SortColumn = 'titolo' | 'tipologia' | 'categoria' | 'stato' | 'sostenitori' | 'dataApertura';
type SortDirection = 'asc' | 'desc';

export default function TableView({ initiatives, baseUrl }: TableViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [sortColumn, setSortColumn] = useState<SortColumn>('dataApertura');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Ottieni categorie e stati unici per i filtri
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
        case 'dataApertura':
          aValue = new Date(a.dataApertura || 0).getTime();
          bValue = new Date(b.dataApertura || 0).getTime();
          break;
        default:
          aValue = a.titolo || '';
          bValue = b.titolo || '';
      }

      if (sortColumn === 'sostenitori' || sortColumn === 'dataApertura') {
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
              <a href={baseUrl} className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium">
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Torna alle iniziative
              </a>
            </div>
            <HamburgerMenu baseUrl={baseUrl} />
          </div>
        </div>
      </header>

      {/* Filtri e ricerca */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            {/* Barra di ricerca */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Cerca per titolo o descrizione..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filtro tipologia */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tutte le tipologie</option>
              {types.map(type => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            {/* Filtro stato */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tutti gli stati</option>
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            {/* Filtro categoria */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tutte le categorie</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Contatore risultati */}
          <div className="mt-4 text-sm text-gray-600">
            Mostrando {filteredAndSortedInitiatives.length} di {initiatives.length} iniziative
          </div>
        </div>
      </div>

      {/* Tabella */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
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
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedInitiatives.map((initiative) => (
                  <tr key={initiative.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <a
                        href={`${baseUrl.replace(/\/$/, '')}/initiative/${initiative.id}`}
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
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAndSortedInitiatives.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Nessuna iniziativa trovata con i filtri selezionati.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
