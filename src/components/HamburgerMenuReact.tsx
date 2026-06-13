import { useState } from 'react';
import {
  HomeIcon,
  ChartBarIcon,
  TableCellsIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { normalizeBaseUrl } from '../lib/paths';
import { menuItems, getMenuItemUrl } from '../config/navigation';

interface HamburgerMenuReactProps {
  baseUrl: string;
}

export default function HamburgerMenuReact({ baseUrl }: HamburgerMenuReactProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Normalizza il baseUrl per gestire correttamente dev e produzione
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl);

  // Mappa delle icone Heroicons
  const iconMap: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
    'HomeIcon': HomeIcon,
    'ChartBarIcon': ChartBarIcon,
    'TableCellsIcon': TableCellsIcon,
    'InformationCircleIcon': InformationCircleIcon,
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        className="relative z-50 flex flex-col justify-center items-center w-10 h-10 bg-transparent border-2 border-white cursor-pointer p-1 transition-all hover:border-civic-terra hover:bg-civic-terra/10"
        aria-label="Menu di navigazione"
        aria-expanded={isOpen}
      >
        <span
          className={`block transition-all duration-300 ease-out h-0.5 w-6 ${
            isOpen ? 'rotate-45 translate-y-1 bg-civic-terra' : '-translate-y-0.5 bg-white'
          }`}
        ></span>
        <span
          className={`bg-white block transition-all duration-300 ease-out h-0.5 w-6 my-0.5 ${
            isOpen ? 'opacity-0' : 'opacity-100'
          }`}
        ></span>
        <span
          className={`block transition-all duration-300 ease-out h-0.5 w-6 ${
            isOpen ? '-rotate-45 -translate-y-1 bg-civic-terra' : 'translate-y-0.5 bg-white'
          }`}
        ></span>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-civic-charcoal bg-opacity-80 z-40"
          onClick={closeMenu}
        />
      )}

      {/* Menu Dropdown */}
      <div
        className={`absolute right-0 mt-2 w-56 bg-white border-3 border-civic-border z-50 transition-all duration-200 ease-in-out ${
          isOpen
            ? 'opacity-100 translate-y-0 visible'
            : 'opacity-0 -translate-y-2 invisible'
        }`}
        style={{ boxShadow: '4px 4px 0 0 rgba(26, 26, 26, 0.15)' }}
      >
        <div className="py-2">
          {menuItems.map((item) => {
            const IconComponent = iconMap[item.icon];
            return (
              <a
                key={item.href}
                href={getMenuItemUrl(item, baseUrl)}
                className="flex items-center px-4 py-3 text-civic-charcoal hover:bg-civic-terra hover:text-white font-bold uppercase text-sm tracking-wide border-l-3 border-transparent hover:border-civic-terra-dark transition-all duration-150"
                onClick={closeMenu}
              >
                {IconComponent && <IconComponent className="w-5 h-5 mr-3" />}
                {item.label}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
