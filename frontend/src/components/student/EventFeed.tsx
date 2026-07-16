// src/components/student/EventFeed.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Categorized event feed. Splits events into sections: Exams, Workshops,
// Holidays, Events, General — and renders them as sorted card lists.

import type { Event, EventCategory } from '../../types';
import EventCard from '../shared/EventCard';
import { AlertCircle } from 'lucide-react';

interface Props {
  events: Event[];
  isSearchResult?: boolean;
  searchQuery?: string;
}

const SECTION_ORDER: EventCategory[] = ['exam', 'workshop', 'holiday', 'event', 'general'];
const SECTION_LABELS: Record<EventCategory, string> = {
  exam:     'Upcoming Exams & Assessments',
  workshop: 'Workshops & Seminars',
  holiday:  'Holidays & Breaks',
  event:    'Events & Fests',
  general:  'General Announcements',
};

export default function EventFeed({ events, isSearchResult = false, searchQuery }: Props) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <AlertCircle className="h-8 w-8 mb-3 text-gray-300" />
        <p className="text-sm font-medium text-gray-500">
          {isSearchResult
            ? `No results found for "${searchQuery}"`
            : 'No upcoming events for your profile.'
          }
        </p>
        {isSearchResult && (
          <p className="text-xs mt-1 text-gray-400">Try searching with different keywords.</p>
        )}
      </div>
    );
  }

  // If it's a search result, render flat list (not categorized)
  if (isSearchResult) {
    return (
      <div className="space-y-3">
        <p className="section-header">
          {events.length} result{events.length !== 1 ? 's' : ''} for &ldquo;{searchQuery}&rdquo;
        </p>
        {events.map((event) => (
          <EventCard key={event.event_id} event={event} />
        ))}
      </div>
    );
  }

  // Group events by category
  const grouped = SECTION_ORDER.reduce<Record<EventCategory, Event[]>>(
    (acc, cat) => {
      acc[cat] = events.filter((e) => e.category === cat);
      return acc;
    },
    { exam: [], workshop: [], holiday: [], event: [], general: [] }
  );

  return (
    <div className="space-y-8">
      {SECTION_ORDER.map((category) => {
        const categoryEvents = grouped[category];
        if (categoryEvents.length === 0) return null;

        return (
          <section key={category} aria-labelledby={`section-${category}`}>
            <h2
              id={`section-${category}`}
              className="section-header mb-3"
            >
              {SECTION_LABELS[category]}
              <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs font-medium">
                {categoryEvents.length}
              </span>
            </h2>
            <div className="space-y-3">
              {categoryEvents.map((event) => (
                <EventCard key={event.event_id} event={event} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
