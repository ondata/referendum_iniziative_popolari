export interface MenuItem {
  href: string;
  label: string;
  icon: string; // Nome dell'icona Heroicons
  external?: boolean;
}

export const menuItems: MenuItem[] = [
  {
    href: '/',
    label: 'Home',
    icon: 'HomeIcon'
  },
  {
    href: '/numeri',
    label: 'Numeri',
    icon: 'ChartBarIcon'
  },
  {
    href: '/tabella',
    label: 'Tabella',
    icon: 'TableCellsIcon'
  },
  {
    href: '/dati',
    label: 'Dati',
    icon: 'ArchiveBoxIcon'
  },
  {
    href: '/info',
    label: 'Info',
    icon: 'InformationCircleIcon'
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
