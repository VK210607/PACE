// src/services/authService.ts
import api from './api';
import type { LoginRequest, TokenResponse } from '../types';

export async function login(payload: LoginRequest): Promise<TokenResponse> {
  const { data } = await api.post<TokenResponse>('/auth/login', payload);
  return data;
}

export interface SignupRequest {
  student_id:  string;
  full_name:   string;
  department:  string;
  year:        number | null;   // null for admin/faculty
  role:        'student' | 'admin';
  password:    string;
}
/**
 * POST /api/auth/signup
 * Sends the registration payload. Backend returns 201 on success.
 * The response body shape is up to your backend (we only check for errors).
 */
export async function signup(payload: SignupRequest): Promise<void> {
  await api.post('/auth/signup', payload);
}