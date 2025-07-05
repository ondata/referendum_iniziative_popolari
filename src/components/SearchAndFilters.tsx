import { useState, useEffect, useCallback } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import type { Initiative } from '../types/initiative';

interface SearchAndFiltersProps {
  initiatives: Initiative[];
  onFilter: (filtered: Initiative[]) => void;
}

export default function SearchAndFilters({ initiatives, onFilter }: SearchAndFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [sortBy, setSortBy] = useState('dataApertura');
  const [isInitialized, setIsInitialized] = useState(false);

  // Funzione per aggiornare l'URL con i parametri attuali
  const updateURL = useCallback((params: {
    search?: string;
    categoria?: string;
    stato?: string;
    tipo?: string;
    ordinamento?: string;
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

    setSearchTerm(search);
    setSelectedCategory(categoria);
    setSelectedStatus(stato);
    setSelectedType(tipo);
    setSortBy(ordinamento);
    setIsInitialized(true);
  }, []);

  // Inizializza i filtri dall'URL al primo caricamento
  useEffect(() => {
    readFromURL();
  }, [readFromURL]);

  // Funzione per cancellare tutti i filtri
  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedStatus('');
    setSelectedType('');
    setSortBy('dataApertura');

    // Pulisci anche l'URL
    if (typeof window !== 'undefined') {
      window.history.replaceState({}, '', window.location.pathname);
    }
  };

  // Controlla se ci sono filtri attivi
  const hasActiveFilters = searchTerm || selectedCategory || selectedStatus || selectedType || sortBy !== 'dataApertura';

  // Aggiorna l'URL quando cambiano i filtri (solo dopo l'inizializzazione)
  useEffect(() => {
    if (isInitialized) {
      updateURL({
        search: searchTerm,
        categoria: selectedCategory,
        stato: selectedStatus,
        tipo: selectedType,
        ordinamento: sortBy
      });
    }
  }, [searchTerm, selectedCategory, selectedStatus, selectedType, sortBy, isInitialized, updateURL]);

  // Estrai categorie, stati e tipologie unici
  const categories = Array.from(
    new Set(initiatives.map(i => i.idDecCatIniziativa?.nome).filter(Boolean))
  ).sort();

  const statuses = Array.from(
    new Set(initiatives.map(i => i.idDecStatoIniziativa?.nome).filter(Boolean))
  ).sort();

  const types = Array.from(
    new Set(
      initiatives
        .map(i => {
          if (i.idDecTipoIniziativa?.id === 4) return 'Legge di iniziativa popolare';
          if (i.idDecTipoIniziativa?.id === 1) return 'Referendum abrogativo';
          return null;
        })
        .filter((type) => type !== null)
    )
  ).sort() as string[];

  // Effettua il filtro quando cambiano i parametri (solo dopo l'inizializzazione)
  useEffect(() => {
    if (!isInitialized) return;

    let filtered = [...initiatives];

    // Filtro per ricerca
    if (searchTerm) {
      filtered = filtered.filter(initiative =>
        initiative.titolo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        initiative.descrizioneBreve?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro per categoria
    if (selectedCategory) {
      filtered = filtered.filter(initiative =>
        initiative.idDecCatIniziativa?.nome === selectedCategory
      );
    }

    // Filtro per stato
    if (selectedStatus) {
      filtered = filtered.filter(initiative =>
        initiative.idDecStatoIniziativa?.nome === selectedStatus
      );
    }

    // Filtro per tipologia
    if (selectedType) {
      filtered = filtered.filter(initiative => {
        if (selectedType === 'Legge di iniziativa popolare') {
          return initiative.idDecTipoIniziativa?.id === 4;
        }
        if (selectedType === 'Referendum abrogativo') {
          return initiative.idDecTipoIniziativa?.id === 1;
        }
        return false;
      });
    }

    // Ordinamento
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'titolo':
          // Pulisci e normalizza i titoli per l'ordinamento
          const titleA = (a.titolo || '');
          const titleB = (b.titolo || '');
          const cleanA = titleA.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
          const cleanB = titleB.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

          return cleanA.localeCompare(cleanB);
        case 'sostenitori':
          return (b.sostenitori || 0) - (a.sostenitori || 0);
        case 'dataApertura':
        default:
          return new Date(b.dataApertura).getTime() - new Date(a.dataApertura).getTime();
      }
    });

    onFilter(filtered);
  }, [searchTerm, selectedCategory, selectedStatus, selectedType, sortBy, initiatives, isInitialized, onFilter]);

  return (
    <div className="space-y-4 mb-8">
      {/* Sezione Filtri */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Filtri</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Barra di ricerca */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Cerca iniziative..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filtro per tipologia */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tutte le tipologie</option>
              {types.map(type => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro per stato */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tutti gli stati</option>
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro per categoria */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tutte le categorie</option>
              {categories.map(category => (
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

      {/* Sezione Ordinamento */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Ordinamento</h3>
          <div className="w-64">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="dataApertura">Data apertura (più recenti)</option>
              <option value="titolo">Titolo (A-Z)</option>
              <option value="sostenitori">Sostenitori (più numerosi)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
