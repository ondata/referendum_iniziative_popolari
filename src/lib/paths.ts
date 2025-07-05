// Utility per gestire i percorsi con base path
export function getBasePath(): string {
  // Durante il build o in ambiente browser, usa la variabile d'ambiente
  return import.meta.env.BASE_URL?.replace(/\/$/, '') || '';
}

export function createPath(path: string): string {
  const basePath = getBasePath();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  // Se basePath è vuoto (modalità dev), restituisci solo il path
  if (!basePath || basePath === '') {
    return cleanPath;
  }

  return basePath + cleanPath;
}

// Utility per gestire correttamente il baseUrl in modalità dev e produzione
export function normalizeBaseUrl(baseUrl: string): string {
  // Se è solo '/', restituisci stringa vuota per evitare doppie slash
  if (baseUrl === '/') {
    return '';
  }
  // Rimuovi trailing slash se presente
  return baseUrl.replace(/\/$/, '');
}
