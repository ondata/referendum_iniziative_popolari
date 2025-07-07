import { useState } from 'react';
import { normalizeBaseUrl } from '../lib/paths';
import { menuItems, getMenuItemUrl } from '../config/navigation';

interface HamburgerMenuReactProps {
  baseUrl: string;
}

export default function HamburgerMenuReact({ baseUrl }: HamburgerMenuReactProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Normalizza il baseUrl per gestire correttamente dev e produzione
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl);

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
        className="flex flex-col justify-center items-center w-8 h-8 bg-transparent border-none cursor-pointer p-1"
        aria-label="Menu di navigazione"
        aria-expanded={isOpen}
      >
        <span
          className={`bg-gray-600 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
            isOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'
          }`}
        ></span>
        <span
          className={`bg-gray-600 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${
            isOpen ? 'opacity-0' : 'opacity-100'
          }`}
        ></span>
        <span
          className={`bg-gray-600 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
            isOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'
          }`}
        ></span>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMenu}
        />
      )}

      {/* Menu Dropdown */}
      <div
        className={`absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 transition-all duration-200 ease-in-out ${
          isOpen
            ? 'opacity-100 translate-y-0 visible'
            : 'opacity-0 -translate-y-2 invisible'
        }`}
      >
        <div className="py-2">
          {menuItems.map((item) => (
            <a
              key={item.href}
              href={getMenuItemUrl(item, baseUrl)}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-150"
              onClick={closeMenu}
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                {item.label}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
