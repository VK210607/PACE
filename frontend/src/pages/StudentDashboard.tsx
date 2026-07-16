// src/pages/StudentDashboard.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Main student page: personalized feed, search, and AI chat toggle.

import { useEffect, useState, useCallback } from 'react';
import { Bot, GraduationCap, Search } from 'lucide-react';
import { format } from 'date-fns';
import type { Event } from '../types';
import { fetchFeed, searchEvents } from '../services/eventService';
import { useAuth } from '../context/AuthContext';
import EventFeed from '../components/student/EventFeed';
import SearchBar from '../components/shared/SearchBar';
import ChatDrawer from '../components/student/ChatDrawer';
import LoadingSpinner from '../components/shared/LoadingSpinner';

export default function StudentDashboard() {
  const { user } = useAuth();

  const [feedEvents,    setFeedEvents]    = useState<Event[]>([]);
  const [searchResults, setSearchResults] = useState<Event[]>([]);
  const [searchQuery,   setSearchQuery]   = useState('');
  const [isSearchMode,  setIsSearchMode]  = useState(false);
  const [isSearching,   setIsSearching]   = useState(false);
  const [isFeedLoading, setIsFeedLoading] = useState(true);
  const [feedError,     setFeedError]     = useState<string | null>(null);
  const [isChatOpen,    setIsChatOpen]    = useState(false);

  // Load personalized feed on mount
  useEffect(() => {
    (async () => {
      try {
        const events = await fetchFeed();
        setFeedEvents(events);
      } catch {
        setFeedError('Failed to load your event feed. Please refresh the page.');
      } finally {
        setIsFeedLoading(false);
      }
    })();
  }, []);

  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    if (!query) {
      setIsSearchMode(false);
      setSearchResults([]);
      return;
    }

    setIsSearchMode(true);
    setIsSearching(true);
    try {
      const results = await searchEvents(query);
      setSearchResults(results);
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Stats for the header
  const examCount     = feedEvents.filter((e) => e.category === 'exam').length;
  const upcomingCount = feedEvents.filter((e) => {
    const days = Math.ceil((new Date(e.event_date).getTime() - Date.now()) / 86400000);
    return days >= 0 && days <= 7;
  }).length;

  return (
    <div className="min-h-full">
      {/* Top header bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold text-gray-900">
              Welcome back, {user?.full_name?.split(' ')[0] || 'Student'} 👋
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {user?.department}
              {user?.year ? ` · Year ${user.year}` : ''}
              {' · '}
              {format(new Date(), 'EEEE, dd MMMM yyyy')}
            </p>
          </div>

          {/* AI Chat toggle button */}
          <button
            id="open-chat-btn"
            onClick={() => setIsChatOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-md
                       bg-maroon-800 text-white hover:bg-maroon-900 transition-colors shadow-sm"
          >
            <Bot className="h-4 w-4" />
            Ask AI
          </button>
        </div>

        {/* Stats row */}
        <div className="px-6 pb-3 flex items-center gap-6 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-red-400" />
            <span>{examCount} exam{examCount !== 1 ? 's' : ''} upcoming</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            <span>{upcomingCount} event{upcomingCount !== 1 ? 's' : ''} this week</span>
          </div>
        </div>
      </div>

      {/* Page body */}
      <div className="px-6 py-5">
        {/* Search bar */}
        <div className="mb-5">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Search className="h-3.5 w-3.5 text-gray-400" />
            <span className="text-xs font-medium text-gray-500">Search all events</span>
          </div>
          <SearchBar onSearch={handleSearch} isSearching={isSearching} />
        </div>

        {/* Content area */}
        {isFeedLoading ? (
          <LoadingSpinner label="Loading your personalized feed..." />
        ) : feedError ? (
          <div className="text-center py-12 text-red-500 text-sm">{feedError}</div>
        ) : isSearchMode ? (
          <EventFeed
            events={searchResults}
            isSearchResult
            searchQuery={searchQuery}
          />
        ) : feedEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <GraduationCap className="h-10 w-10 mb-3 text-gray-200" />
            <p className="text-sm font-medium text-gray-500">No events found for your profile.</p>
            <p className="text-xs mt-1 text-gray-400">Check back later or contact your department office.</p>
          </div>
        ) : (
          <EventFeed events={feedEvents} />
        )}
      </div>

      {/* Floating chat button (mobile) */}
      <button
        className="fixed bottom-6 right-6 z-20 lg:hidden h-12 w-12 rounded-full
                   bg-maroon-800 text-white flex items-center justify-center
                   shadow-lg hover:bg-maroon-900 transition-colors"
        onClick={() => setIsChatOpen(true)}
        aria-label="Open AI chat"
      >
        <Bot className="h-5 w-5" />
      </button>

      {/* Chat drawer */}
      <ChatDrawer isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}
