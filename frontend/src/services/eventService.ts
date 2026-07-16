// src/services/eventService.ts
import api from './api';
import type { DraftEvent, Event, EventCreate } from '../types';

/** Fetch the personalized event feed for the logged-in student. */
export async function fetchFeed(): Promise<Event[]> {
  const { data } = await api.get<Event[]>('/events/feed');
  return data;
}

/** Full-text search across all events. */
export async function searchEvents(query: string): Promise<Event[]> {
  const { data } = await api.get<Event[]>('/events/search', { params: { q: query } });
  return data;
}

/** Admin: manually create a single event. */
export async function createEvent(payload: EventCreate): Promise<Event> {
  const { data } = await api.post<Event>('/admin/create-event', payload);
  return data;
}

/** Admin: upload a PDF and get back draft events for review. */
export async function ingestPDF(file: File): Promise<DraftEvent[]> {
  const form = new FormData();
  form.append('file', file);
  const { data } = await api.post<DraftEvent[]>('/admin/ingest-pdf', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

/** Admin: confirm AI-extracted events and persist them. */
export async function confirmEvents(events: EventCreate[]): Promise<Event[]> {
  const { data } = await api.post<Event[]>('/admin/confirm-events', { events });
  return data;
}
