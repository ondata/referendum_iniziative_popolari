// Utility per gestire i percorsi con base path
export function getBasePath(): string {
  // In ambiente browser, usiamo il base path dalla configurazione
  if (typeof window !== 'undefined') {
    // Ottieni il base path dal DOM o usa il default
    const base = document.querySelector('base')?.getAttribute('href') || '/';
    return base.endsWith('/') ? base.slice(0, -1) : base;
  }

  // Durante il build, usa la variabile d'ambiente
  return import.meta.env.BASE_URL?.replace(/\/$/, '') || '';
}

export function createPath(path: string): string {
  const basePath = getBasePath();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return basePath + cleanPath;
}
