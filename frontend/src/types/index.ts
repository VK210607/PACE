// src/types/index.ts
// ─────────────────────────────────────────────────────────────────────────────
// Shared TypeScript interfaces mirroring the backend Pydantic schemas.
// Single source of truth for all data shapes used across the frontend.

export type UserRole = 'student' | 'admin';

export type EventCategory = 'exam' | 'workshop' | 'holiday' | 'event' | 'general';

// ── Auth ──────────────────────────────────────────────────────────────────────
export interface AuthUser {
  user_id: string;
  student_id: string;
  role: UserRole;
  full_name: string | null;
  department: string | null;
  year: number | null;
}

export interface LoginRequest {
  student_id: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  role: UserRole;
  full_name: string | null;
  department: string | null;
  year: number | null;
  user_id: string;
}

// ── Events ────────────────────────────────────────────────────────────────────
export interface Event {
  event_id: string;
  title: string;
  description: string;
  category: EventCategory;
  event_date: string;       // ISO date string 'YYYY-MM-DD'
  target_dept: string;
  target_year: number;
  created_at: string;       // ISO datetime string
}

export interface EventCreate {
  title: string;
  description: string;
  category: EventCategory;
  event_date: string;
  target_dept: string;
  target_year: number;
}

export interface DraftEvent extends EventCreate {
  source_text?: string;     // Original extracted text for admin review
}

// ── Chat ──────────────────────────────────────────────────────────────────────
export type MessageRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  isStreaming?: boolean;
}
