// Utility per gestire i percorsi con base path
export function getBasePath(): string {
  // Durante il build o in ambiente browser, usa la variabile d'ambiente
  return import.meta.env.BASE_URL?.replace(/\/$/, '') || '';
}

export function createPath(path: string): string {
  const basePath = getBasePath();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return basePath + cleanPath;
}
