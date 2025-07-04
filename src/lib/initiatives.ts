import type { Initiative } from '../types/initiative';
import sampleData from '../data/sample-initiatives.json';

export async function fetchInitiatives(): Promise<Initiative[]> {
  const url = 'https://firmereferendum.giustizia.it/referendum/api-portal/iniziativa/public?v=1751271726271';

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.warn('API error, using sample data');
      return sampleData as Initiative[];
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

    console.warn('Invalid API response, using sample data');
    return sampleData as Initiative[];
  } catch (error) {
    console.warn('Error fetching data, using sample data:', error);
    return sampleData as Initiative[];
  }
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
