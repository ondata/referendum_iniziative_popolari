import {
  CalendarIcon,
  UserGroupIcon,
  TagIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import type { Initiative } from '../types/initiative';
import { formatDate, formatNumber } from '../lib/initiatives';
import { createPath } from '../lib/paths';

interface InitiativeCardProps {
  initiative: Initiative;
}

export default function InitiativeCard({ initiative }: InitiativeCardProps) {
  const isChiusa = initiative.idDecStatoIniziativa?.nome?.includes('CHIUSA');

  return (
    <a
      href={createPath(`/initiative/${initiative.id}/`)}
      className={`card-shadow rounded-lg p-6 hover:scale-[1.02] transition-all duration-200 cursor-pointer border block no-underline ${
        isChiusa
          ? 'bg-gray-50 border-gray-300 opacity-75'
          : 'bg-white border-gray-200'
      }`}
    >
      {/* Header con categoria e stato */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <TagIcon className="w-3 h-3 mr-1" />
          {initiative.idDecCatIniziativa?.nome || 'Categoria non specificata'}
        </span>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          initiative.idDecStatoIniziativa?.nome?.includes('RACCOLTA')
            ? 'bg-green-100 text-green-800'
            : isChiusa
            ? 'bg-gray-200 text-gray-600'
            : 'bg-gray-100 text-gray-800'
        }`}>
          <ClockIcon className="w-3 h-3 mr-1" />
          {initiative.idDecStatoIniziativa?.nome || 'Stato non specificato'}
        </span>
      </div>

      {/* Titolo */}
      <h3 className={`text-lg font-semibold mb-3 line-clamp-2 ${
        isChiusa ? 'text-gray-500' : 'text-gray-900'
      }`} title={initiative.titolo}>
        {initiative.titolo}
      </h3>

      {/* Descrizione breve */}
      {initiative.descrizioneBreve && (
        <p className={`text-sm mb-4 line-clamp-3 ${
          isChiusa ? 'text-gray-500' : 'text-gray-600'
        }`}>
          {initiative.descrizioneBreve}
        </p>
      )}

      {/* Informazioni aggiuntive */}
      <div className="space-y-2 text-sm text-gray-500">
        <div className="flex items-center">
          <CalendarIcon className="w-4 h-4 mr-2" />
          <span>Apertura: {formatDate(initiative.dataApertura)}</span>
        </div>

        {initiative.sostenitori !== undefined && (
          <div className="flex items-center">
            <UserGroupIcon className="w-4 h-4 mr-2" />
            <span>Sostenitori: {formatNumber(initiative.sostenitori)}</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <span className={`text-sm font-medium ${
          isChiusa
            ? 'text-gray-500 hover:text-gray-600'
            : 'text-blue-600 hover:text-blue-700'
        }`}>
          Visualizza dettagli →
        </span>
      </div>
    </a>
  );
}
