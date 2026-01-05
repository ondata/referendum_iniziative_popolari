import type { Initiative } from '../types/initiative';
import sampleData from '../data/sample-initiatives.json';

export async function fetchInitiatives(): Promise<Initiative[]> {
  const url = 'https://firmereferendum.giustizia.it/referendum/api-portal/iniziativa/public';

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.warn('API error, trying local source.json');
      return await loadLocalData();
    }
    const data = await response.json();

    // L'API restituisce i dati in una proprietà 'content'
    if (data && data.content && Array.isArray(data.content)) {
      return data.content as Initiative[];
    }

    // Se non c'è 'content', prova a usare direttamente l'array
    if (Array.isArray(data)) {
      return data as Initiative[];
    }

    console.warn('Invalid API response, trying local source.json');
    return await loadLocalData();
  } catch (error) {
    console.warn('Error fetching data, trying local source.json:', error);
    return await loadLocalData();
  }
}

async function loadLocalData(): Promise<Initiative[]> {
  try {
    // Prova a caricare il file source.json dalla cartella data
    const sourceData = await import('../../data/source.json');

    // Il file source.json ha sempre la struttura dell'API con la proprietà 'content'
    if (sourceData.default && sourceData.default.content && Array.isArray(sourceData.default.content)) {
      console.log('✅ Using local source.json');
      return sourceData.default.content as Initiative[];
    }

    console.warn('Invalid structure in local source.json');
  } catch (error) {
    console.warn('Error loading local source.json, using sample data:', error);
  }

  // Fallback finale ai dati di esempio
  console.log('📝 Using sample data as final fallback');
  return sampleData as Initiative[];
}

export function formatDate(dateString: string): string {
  if (!dateString) return 'Data non disponibile';

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    return dateString;
  }
}

export function formatNumber(num: number | undefined): string {
  if (num === undefined || num === null) return '0';
  return num.toLocaleString('it-IT');
}

/**
 * Normalizza un titolo per l'ordinamento alfabetico rimuovendo:
 * - Caratteri non alfabetici all'inizio del titolo (virgolette, simboli, etc.)
 * - Accenti e caratteri speciali
 * - Spazi extra
 */
export function normalizeForSorting(title: string): string {
  if (!title) return '';

  // Rimuovi spazi all'inizio e alla fine
  let normalized = title.trim();

  // Rimuovi caratteri non alfabetici all'inizio del titolo
  // Questa regex rimuove tutto quello che non è una lettera o un numero all'inizio
  normalized = normalized.replace(/^[^\p{L}\p{N}]+/u, '');

  // Converti in minuscolo e rimuovi accenti
  normalized = normalized.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  return normalized;
}

export function generateSlug(title: string, id: number): string {
  // Usa solo l'ID come slug
  return `${id}`;
}

export function getInitiativeUrl(initiative: Initiative): string {
  // Controlla se l'iniziativa esiste
  if (!initiative) {
    return 'https://firmereferendum.giustizia.it';
  }

  // URL ufficiale per firmare usando l'ID dell'iniziativa
  return `https://firmereferendum.giustizia.it/referendum/open/dettaglio-open/${initiative.id}`;
}

export function isSigningActive(initiative: Initiative): boolean {
  // Controlla solo lo stato ufficiale dell'iniziativa
  // Se il Ministero ha marcato l'iniziativa come "IN RACCOLTA FIRME",
  // è quella la fonte di verità più affidabile
  return initiative.idDecStatoIniziativa?.nome === 'IN RACCOLTA FIRME';
}

export function hasReachedQuorum(initiative: Initiative): boolean {
  // Controlla se l'iniziativa ha raggiunto il quorum
  // Entrambi i valori devono essere definiti e sostenitori deve essere >= quorum
  if (initiative.sostenitori === undefined || initiative.quorum === undefined) {
    return false;
  }
  return initiative.sostenitori >= initiative.quorum;
}

export function normalizeUrl(url: string | undefined): string | undefined {
  if (!url || typeof url !== 'string') return undefined;

  // Rimuovi spazi bianchi all'inizio e alla fine
  const trimmedUrl = url.trim();
  if (!trimmedUrl) return undefined;

  // Se l'URL inizia già con http:// o https://, restituiscilo così com'è
  if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
    return trimmedUrl;
  }

  // Se l'URL inizia con "https:" ma manca il "//" (errore comune), correggilo
  if (trimmedUrl.startsWith('https:') && !trimmedUrl.startsWith('https://')) {
    return trimmedUrl.replace('https:', 'https://');
  }

  // Se l'URL inizia con "http:" ma manca il "//" (errore comune), correggilo
  if (trimmedUrl.startsWith('http:') && !trimmedUrl.startsWith('http://')) {
    return trimmedUrl.replace('http:', 'http://');
  }

  // Se l'URL inizia con "www.", aggiungi https://
  if (trimmedUrl.startsWith('www.')) {
    return `https://${trimmedUrl}`;
  }

  // Se l'URL sembra un dominio valido (contiene un punto), aggiungi https://
  if (trimmedUrl.includes('.') && !trimmedUrl.includes(' ')) {
    return `https://${trimmedUrl}`;
  }

  // Se non riusciamo a identificare il formato, restituiamo undefined
  return undefined;
}

/**
 * Ottiene un massimo di 3 iniziative correlate dalla stessa categoria,
 * selezionate casualmente ed escludendo l'iniziativa corrente.
 * Mostra solo le iniziative con raccolta firme attiva.
 * Restituisce sempre il numero massimo disponibile fino a maxItems.
 */
export function getRelatedInitiatives(
  currentInitiative: Initiative,
  allInitiatives: Initiative[],
  maxItems: number = 3
): Initiative[] {
  // Filtra le iniziative della stessa categoria, escludendo quella corrente
  // e includendo solo quelle con raccolta firme attiva
  const sameCategory = allInitiatives.filter(initiative =>
    initiative.id !== currentInitiative.id &&
    initiative.idDecCatIniziativa?.id === currentInitiative.idDecCatIniziativa?.id &&
    isSigningActive(initiative)
  );

  // Se non ci sono iniziative nella stessa categoria, restituisci array vuoto
  if (sameCategory.length === 0) {
    return [];
  }

  // Se ci sono meno iniziative del massimo richiesto, restituisci tutte
  if (sameCategory.length <= maxItems) {
    return sameCategory;
  }

  // Seleziona casualmente le iniziative garantendo di restituire sempre maxItems
  const shuffled = [...sameCategory].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, maxItems);
}
