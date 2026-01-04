import { ShareIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

interface ShareButtonProps {
  url: string;
  title: string;
  description?: string;
}

interface ShareOption {
  name: string;
  icon: string;
  url: string;
  color: string;
}

export default function ShareButton({ url, title, description = '' }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Funzione per condividere usando Web Share API (nativa)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        });
      } catch (error) {
        console.log('Condivisione annullata o errore:', error);
      }
    } else {
      // Fallback: mostra il menu di condivisione personalizzato
      setIsOpen(!isOpen);
    }
  };

  // Opzioni di condivisione per il fallback desktop
  const shareOptions: ShareOption[] = [
    {
      name: 'WhatsApp',
      icon: '💬',
      url: `https://wa.me/?text=${encodeURIComponent(`${title}\n\n${description}\n\n${url}`)}`,
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      name: 'Telegram',
      icon: '✈️',
      url: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(`${title}\n\n${description}`)}`,
      color: 'bg-blue-400 hover:bg-blue-500'
    },
    {
      name: 'Twitter',
      icon: '🐦',
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(`${title}\n\n${description}`)}`,
      color: 'bg-sky-500 hover:bg-sky-600'
    },
    {
      name: 'Facebook',
      icon: '📘',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      name: 'LinkedIn',
      icon: '💼',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      color: 'bg-blue-700 hover:bg-blue-800'
    }
  ];

  const handleShareOptionClick = (shareUrl: string) => {
    window.open(shareUrl, '_blank', 'width=600,height=400');
    setIsOpen(false);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      // Potresti aggiungere qui una notifica di successo
      setIsOpen(false);
    } catch (error) {
      console.error('Errore nel copiare il link:', error);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={handleNativeShare}
        aria-label="Condividi questa iniziativa"
        aria-expanded={isOpen && !navigator.share}
        aria-controls="share-menu"
        className="inline-flex items-center px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors duration-200"
      >
        <ShareIcon className="w-5 h-5 mr-2" />
        Condividi
      </button>

      {/* Menu di condivisione per fallback desktop */}
      {isOpen && !navigator.share && (
        <div
          id="share-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Opzioni di condivisione"
          className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
        >
          <div className="p-3">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Condividi su:</h3>
            <div className="space-y-2">
              {shareOptions.map((option) => (
                <button
                  key={option.name}
                  onClick={() => handleShareOptionClick(option.url)}
                  aria-label={`Condividi su ${option.name}`}
                  className={`w-full flex items-center px-3 py-2 text-white rounded ${option.color} transition-colors duration-200`}
                >
                  <span className="mr-3 text-lg">{option.icon}</span>
                  <span className="text-sm font-medium">{option.name}</span>
                </button>
              ))}

              {/* Opzione copia link */}
              <button
                onClick={copyToClipboard}
                aria-label="Copia il link dell'iniziativa negli appunti"
                className="w-full flex items-center px-3 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition-colors duration-200"
              >
                <span className="mr-3 text-lg">📋</span>
                <span className="text-sm font-medium">Copia link</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay per chiudere il menu quando si clicca fuori */}
      {isOpen && !navigator.share && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
