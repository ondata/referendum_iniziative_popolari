import {
  CalendarIcon,
  UserGroupIcon,
  TagIcon,
  ClockIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';
import type { Initiative } from '../types/initiative';
import { formatDate, formatNumber } from '../lib/initiatives';
import { createPath } from '../lib/paths';

interface InitiativeCardProps {
  initiative: Initiative;
}

export default function InitiativeCard({ initiative }: InitiativeCardProps) {
  const isChiusa = initiative.idDecStatoIniziativa?.nome?.includes('CHIUSA');
  const hasReachedQuorum = initiative.quorum !== undefined &&
                           initiative.sostenitori !== undefined &&
                           initiative.sostenitori >= initiative.quorum;

  const percentageOfQuorum = initiative.quorum && initiative.sostenitori
    ? Math.round((initiative.sostenitori / initiative.quorum) * 100)
    : 0;

  return (
    <a
      href={createPath(`/initiative/${initiative.id}/`)}
      className={`card-shadow p-6 cursor-pointer block no-underline relative group transition-all duration-300 ${
        isChiusa
          ? 'bg-civic-stone/50 opacity-60'
          : hasReachedQuorum
          ? 'bg-civic-terra-light border-civic-terra'
          : 'bg-white'
      }`}
    >
      {/* Quorum Badge - Angular brutalist style */}
      {hasReachedQuorum && (
        <div className="absolute -top-2 -right-2 bg-civic-success text-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1 border-2 border-civic-border civic-badge z-10">
          <CheckBadgeIcon className="w-4 h-4" />
          QUORUM
        </div>
      )}

      {/* Decorative corner element */}
      <div className="absolute top-0 left-0 w-12 h-12 border-l-3 border-t-3 border-civic-terra opacity-20"></div>

      {/* Header with category and status - Angular badges */}
      <div className="flex flex-wrap gap-2 mb-4 relative z-10">
        <span className="civic-badge bg-civic-charcoal text-white text-[10px]">
          <TagIcon className="w-3 h-3 mr-1" />
          {initiative.idDecCatIniziativa?.nome || 'Non specificata'}
        </span>
        <span className={`civic-badge text-[10px] ${
          initiative.idDecStatoIniziativa?.nome?.includes('RACCOLTA')
            ? 'bg-civic-success text-white'
            : isChiusa
            ? 'bg-civic-neutral text-white'
            : 'bg-civic-stone text-civic-charcoal border-civic-neutral'
        }`}>
          <ClockIcon className="w-3 h-3 mr-1" />
          {initiative.idDecStatoIniziativa?.nome || 'Non specificato'}
        </span>
      </div>

      {/* Title - Serif font for editorial feel */}
      <h3 className={`font-serif text-xl font-bold mb-3 line-clamp-2 leading-tight ${
        isChiusa ? 'text-civic-neutral' : 'text-civic-charcoal'
      }`} title={initiative.titoloLeggeCostituzionale}>
        {initiative.titoloLeggeCostituzionale}
      </h3>

      {/* Description */}
      {initiative.descrizioneBreve && (
        <p className={`text-sm mb-5 line-clamp-3 leading-relaxed ${
          isChiusa ? 'text-civic-neutral' : 'text-civic-neutral'
        }`}>
          {initiative.descrizioneBreve}
        </p>
      )}

      {/* Data Grid - Structured layout */}
      <div className="space-y-3 text-sm mb-5 border-l-3 border-civic-terra pl-4">
        <div className="flex items-center text-civic-charcoal">
          <CalendarIcon className="w-4 h-4 mr-2 text-civic-terra" />
          <span className="font-medium">Apertura:</span>
          <span className="ml-2 civic-number">{formatDate(initiative.dataApertura)}</span>
        </div>

        {initiative.sostenitori !== undefined && (
          <div className="space-y-1">
            <div className="flex items-center text-civic-charcoal">
              <UserGroupIcon className="w-4 h-4 mr-2 text-civic-terra" />
              <span className="font-medium">Sostenitori:</span>
              <span className="ml-2 civic-number font-bold">{formatNumber(initiative.sostenitori)}</span>
            </div>
            {initiative.quorum !== undefined && (
              <div className="ml-6">
                {/* Progress bar */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-civic-stone border border-civic-border">
                    <div
                      className={`h-full transition-all duration-500 ${
                        hasReachedQuorum ? 'bg-civic-success' : 'bg-civic-terra'
                      }`}
                      style={{ width: `${Math.min(percentageOfQuorum, 100)}%` }}
                    ></div>
                  </div>
                  <span className={`text-xs font-bold civic-number min-w-[3rem] text-right ${
                    hasReachedQuorum ? 'text-civic-success' : 'text-civic-terra-dark'
                  }`}>
                    {percentageOfQuorum}%
                  </span>
                </div>
                <div className="text-xs text-civic-neutral mt-1">
                  Quorum: <span className="civic-number">{formatNumber(initiative.quorum)}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer - Strong CTA */}
      <div className="pt-4 border-t-3 border-civic-border flex items-center justify-between">
        <span className={`text-sm font-bold uppercase tracking-wide transition-colors ${
          isChiusa
            ? 'text-civic-neutral'
            : 'text-civic-terra group-hover:text-civic-terra-dark'
        }`}>
          Dettagli
        </span>
        <div className={`w-8 h-8 border-2 flex items-center justify-center transition-transform group-hover:translate-x-1 ${
          isChiusa ? 'border-civic-neutral' : 'border-civic-terra'
        }`}>
          <span className={isChiusa ? 'text-civic-neutral' : 'text-civic-terra'}>→</span>
        </div>
      </div>
    </a>
  );
}
