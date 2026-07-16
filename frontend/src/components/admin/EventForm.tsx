// src/components/admin/EventForm.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Admin manual event creation form.

import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import type { EventCategory, EventCreate } from '../../types';
import { createEvent } from '../../services/eventService';

const DEPARTMENTS = [
  'All',
  'Computer Science',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical Engineering',
  'Electronics & Communication',
  'Information Technology',
];

const CATEGORIES: { value: EventCategory; label: string }[] = [
  { value: 'exam',     label: 'Exam / Assessment' },
  { value: 'workshop', label: 'Workshop / Seminar' },
  { value: 'holiday',  label: 'Holiday / Break'   },
  { value: 'event',    label: 'Event / Fest'       },
  { value: 'general',  label: 'General Announcement' },
];

const BLANK_FORM: EventCreate = {
  title:       '',
  description: '',
  category:    'general',
  event_date:  '',
  target_dept: 'All',
  target_year: 0,
};

export default function EventForm() {
  const [form,      setForm]      = useState<EventCreate>(BLANK_FORM);
  const [isLoading, setIsLoading] = useState(false);
  const [success,   setSuccess]   = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'target_year' ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await createEvent(form);
      setSuccess(true);
      setForm(BLANK_FORM);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { detail?: string } } }).response?.data?.detail
          : 'An unexpected error occurred.';
      setError(message ?? 'Failed to create event.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Success toast */}
      {success && (
        <div className="flex items-center gap-2 p-3 rounded-md bg-green-50 border border-green-200 text-green-700 text-sm animate-fade-in">
          <CheckCircle className="h-4 w-4 flex-shrink-0" />
          Event created and indexed for AI search.
        </div>
      )}

      {/* Error toast */}
      {error && (
        <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm animate-fade-in">
          {error}
        </div>
      )}

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-xs font-medium text-gray-700 mb-1">
          Event Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. Internal Assessment — Data Structures"
          className="input-field"
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-xs font-medium text-gray-700 mb-1">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={3}
          value={form.description}
          onChange={handleChange}
          placeholder="Provide all relevant details: venue, syllabus, instructions..."
          className="input-field resize-none"
        />
      </div>

      {/* Category + Date row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="category" className="block text-xs font-medium text-gray-700 mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            name="category"
            required
            value={form.category}
            onChange={handleChange}
            className="input-field"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="event_date" className="block text-xs font-medium text-gray-700 mb-1">
            Event Date <span className="text-red-500">*</span>
          </label>
          <input
            id="event_date"
            name="event_date"
            type="date"
            required
            value={form.event_date}
            onChange={handleChange}
            className="input-field"
          />
        </div>
      </div>

      {/* Target Department + Year row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="target_dept" className="block text-xs font-medium text-gray-700 mb-1">
            Target Department
          </label>
          <select
            id="target_dept"
            name="target_dept"
            value={form.target_dept}
            onChange={handleChange}
            className="input-field"
          >
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="target_year" className="block text-xs font-medium text-gray-700 mb-1">
            Target Year
          </label>
          <select
            id="target_year"
            name="target_year"
            value={form.target_year}
            onChange={handleChange}
            className="input-field"
          >
            <option value={0}>All Years</option>
            <option value={1}>Year 1</option>
            <option value={2}>Year 2</option>
            <option value={3}>Year 3</option>
            <option value={4}>Year 4</option>
          </select>
        </div>
      </div>

      {/* Submit */}
      <div className="pt-1">
        <button type="submit" disabled={isLoading} className="btn-primary w-full">
          {isLoading ? 'Creating Event...' : 'Create Event'}
        </button>
      </div>
    </form>
  );
}
