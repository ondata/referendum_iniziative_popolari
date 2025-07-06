import type { Initiative } from '../types/initiative';
import sampleData from '../data/sample-initiatives.json';

export async function fetchInitiatives(): Promise<Initiative[]> {
  const url = 'https://firmereferendum.giustizia.it/referendum/api-portal/iniziativa/public?v=1751271726271';

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

    if (sourceData.default && sourceData.default.content && Array.isArray(sourceData.default.content)) {
      console.log('✅ Using local source.json');
      return sourceData.default.content as Initiative[];
    }

    if (Array.isArray(sourceData.default)) {
      console.log('✅ Using local source.json (direct array)');
      return sourceData.default as Initiative[];
    }
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
  // Se non c'è dataFineRaccolta, assumiamo che sia ancora attiva
  if (!initiative.dataFineRaccolta) return true;

  try {
    const endDate = new Date(initiative.dataFineRaccolta);
    const today = new Date();

    // Confronta solo le date (senza orario)
    endDate.setHours(23, 59, 59, 999);
    today.setHours(0, 0, 0, 0);

    return endDate >= today;
  } catch (error) {
    // In caso di errore, assumiamo che sia ancora attiva
    return true;
  }
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
