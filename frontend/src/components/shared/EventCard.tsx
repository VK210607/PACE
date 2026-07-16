// src/components/shared/EventCard.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Displays a single event in a clean, information-dense card layout.

import { format, parseISO, differenceInDays } from 'date-fns';
import { Calendar, Users, Clock } from 'lucide-react';
import type { Event } from '../../types';
import CategoryBadge from './CategoryBadge';

interface Props {
  event: Event;
}

function getDaysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = parseISO(dateStr);
  return differenceInDays(target, today);
}

function DaysUntilChip({ days }: { days: number }) {
  if (days < 0) return <span className="text-xs text-gray-400">Past</span>;
  if (days === 0) return (
    <span className="text-xs font-semibold text-white bg-maroon-800 px-2 py-0.5 rounded-full">
      Today
    </span>
  );
  if (days <= 3) return (
    <span className="text-xs font-semibold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
      In {days}d
    </span>
  );
  if (days <= 7) return (
    <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
      In {days}d
    </span>
  );
  return (
    <span className="text-xs text-gray-500 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-full">
      In {days}d
    </span>
  );
}

export default function EventCard({ event }: Props) {
  const daysUntil = getDaysUntil(event.event_date);
  const isUrgent  = daysUntil >= 0 && daysUntil <= 3;
  const isPast    = daysUntil < 0;

  return (
    <article
      className={`card p-4 transition-shadow duration-200 hover:shadow-card-hover animate-fade-in
        ${isUrgent ? 'border-l-4 border-l-maroon-800' : ''}
        ${isPast   ? 'opacity-60' : ''}
      `}
    >
      {/* Top row: category + urgency chip */}
      <div className="flex items-center justify-between mb-2">
        <CategoryBadge category={event.category} />
        <DaysUntilChip days={daysUntil} />
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold text-gray-900 leading-snug mb-1">
        {event.title}
      </h3>

      {/* Description — limited to 2 lines */}
      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">
        {event.description}
      </p>

      {/* Metadata row */}
      <div className="flex items-center gap-4 text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          {format(parseISO(event.event_date), 'dd MMM yyyy')}
        </span>

        {event.target_dept !== 'All' && (
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {event.target_dept}
          </span>
        )}

        {event.target_year > 0 && (
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            Year {event.target_year}
          </span>
        )}

        {event.target_dept === 'All' && event.target_year === 0 && (
          <span className="flex items-center gap-1 text-maroon-700 font-medium">
            <Users className="h-3.5 w-3.5" />
            All Departments
          </span>
        )}
      </div>
    </article>
  );
}
