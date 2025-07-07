export interface MenuItem {
  href: string;
  label: string;
  icon: string; // SVG path o nome icona
  external?: boolean;
}

export const menuItems: MenuItem[] = [
  {
    href: '/',
    label: 'Home',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
  },
  {
    href: '/numeri',
    label: 'Numeri',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
  },
  {
    href: '/tabella',
    label: 'Tabella',
    icon: 'M3 10h18M3 14h18m-9-4v8m-7 0V4a2 2 0 012-2h14a2 2 0 012 2v16a2 2 0 01-2 2H5a2 2 0 01-2-2z'
  },
  {
    href: '/info',
    label: 'Info',
    icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  }
];

// Funzione helper per ottenere l'URL completo di una voce di menu
export function getMenuItemUrl(item: MenuItem, baseUrl: string): string {
  if (item.external || item.href.startsWith('http')) {
    return item.href;
  }
  
  const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  return item.href === '/' ? (normalizedBaseUrl || '/') : `${normalizedBaseUrl}${item.href}`;
}
