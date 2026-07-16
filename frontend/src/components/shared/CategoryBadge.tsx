// src/components/shared/CategoryBadge.tsx
// Color-coded pill badge for event categories.

import type { EventCategory } from '../../types';

interface Props {
  category: EventCategory;
  className?: string;
}

const CONFIG: Record<EventCategory, { label: string; className: string }> = {
  exam:     { label: 'Exam',     className: 'bg-red-50 text-red-700 border-red-200' },
  workshop: { label: 'Workshop', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  holiday:  { label: 'Holiday',  className: 'bg-green-50 text-green-700 border-green-200' },
  event:    { label: 'Event',    className: 'bg-purple-50 text-purple-700 border-purple-200' },
  general:  { label: 'General',  className: 'bg-gray-50 text-gray-600 border-gray-200' },
};

export default function CategoryBadge({ category, className = '' }: Props) {
  const { label, className: colorClass } = CONFIG[category];
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${colorClass} ${className}`}
    >
      {label}
    </span>
  );
}
