// src/components/admin/DraftReview.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Admin review UI for AI-extracted draft events.
// Admin can edit each field, discard individual items, then confirm to publish.

import { useState } from 'react';
import { CheckCircle, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import type { DraftEvent, EventCategory, EventCreate } from '../../types';
import CategoryBadge from '../shared/CategoryBadge';
import { confirmEvents } from '../../services/eventService';

interface Props {
  drafts: DraftEvent[];
  onConfirmed: () => void;
}

const CATEGORIES: EventCategory[] = ['exam', 'workshop', 'holiday', 'event', 'general'];

export default function DraftReview({ drafts, onConfirmed }: Props) {
  const [items,     setItems]     = useState<DraftEvent[]>(drafts);
  const [expanded,  setExpanded]  = useState<Set<number>>(new Set([0]));
  const [isLoading, setIsLoading] = useState(false);
  const [error,     setError]     = useState<string | null>(null);
  const [success,   setSuccess]   = useState(false);

  const toggleExpand = (index: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  };

  const updateItem = (index: number, field: keyof DraftEvent, value: string | number) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const payload: EventCreate[] = items.map(({ source_text: _st, ...rest }) => rest);
      await confirmEvents(payload);
      setSuccess(true);
      setTimeout(onConfirmed, 1500);
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { detail?: string } } }).response?.data?.detail
          : undefined;
      setError(message ?? 'Failed to publish events.');
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p className="text-sm">All draft events have been removed.</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex items-center justify-center gap-2 p-4 rounded-md bg-green-50 border border-green-200 text-green-700 animate-fade-in">
        <CheckCircle className="h-5 w-5" />
        <p className="text-sm font-medium">{items.length} events published and indexed for AI search.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          <span className="font-medium text-gray-900">{items.length}</span> events extracted — review and edit before publishing.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Draft cards */}
      <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
        {items.map((draft, index) => (
          <div key={index} className="card overflow-hidden animate-fade-in">
            {/* Collapsed header */}
            <div
              className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleExpand(index)}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <CategoryBadge category={draft.category} />
                <span className="text-sm font-medium text-gray-800 truncate">{draft.title || 'Untitled'}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs text-gray-400">
                  {draft.event_date
                    ? format(parseISO(draft.event_date), 'dd MMM yyyy')
                    : 'No date'
                  }
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); removeItem(index); }}
                  className="p-1 rounded text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                  aria-label="Remove event"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
                {expanded.has(index)
                  ? <ChevronUp className="h-4 w-4 text-gray-400" />
                  : <ChevronDown className="h-4 w-4 text-gray-400" />
                }
              </div>
            </div>

            {/* Expanded editor */}
            {expanded.has(index) && (
              <div className="px-4 pb-4 space-y-3 border-t border-gray-100 pt-3 bg-gray-50/50">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
                  <input
                    type="text"
                    value={draft.title}
                    onChange={(e) => updateItem(index, 'title', e.target.value)}
                    className="input-field text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={draft.description}
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                    className="input-field text-sm resize-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
                    <select
                      value={draft.category}
                      onChange={(e) => updateItem(index, 'category', e.target.value)}
                      className="input-field text-sm"
                    >
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Date</label>
                    <input
                      type="date"
                      value={draft.event_date}
                      onChange={(e) => updateItem(index, 'event_date', e.target.value)}
                      className="input-field text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Year</label>
                    <select
                      value={draft.target_year}
                      onChange={(e) => updateItem(index, 'target_year', parseInt(e.target.value, 10))}
                      className="input-field text-sm"
                    >
                      <option value={0}>All</option>
                      <option value={1}>Year 1</option>
                      <option value={2}>Year 2</option>
                      <option value={3}>Year 3</option>
                      <option value={4}>Year 4</option>
                    </select>
                  </div>
                </div>

                {/* Source text reference */}
                {draft.source_text && (
                  <details className="text-xs">
                    <summary className="cursor-pointer text-gray-400 hover:text-gray-600">
                      View source text
                    </summary>
                    <p className="mt-1.5 p-2 bg-white border border-gray-200 rounded text-gray-500 leading-relaxed">
                      {draft.source_text}
                    </p>
                  </details>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Confirm button */}
      <div className="pt-2">
        <button
          onClick={handleConfirm}
          disabled={isLoading || items.length === 0}
          className="btn-gold w-full"
        >
          {isLoading
            ? 'Publishing...'
            : `Confirm & Publish ${items.length} Event${items.length !== 1 ? 's' : ''}`
          }
        </button>
        <p className="text-xs text-center text-gray-400 mt-2">
          Events will be indexed for AI chat search immediately.
        </p>
      </div>
    </div>
  );
}
