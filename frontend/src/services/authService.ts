// src/services/authService.ts
import api from './api';
import type { LoginRequest, TokenResponse } from '../types';

export async function login(payload: LoginRequest): Promise<TokenResponse> {
  const { data } = await api.post<TokenResponse>('/auth/login', payload);
  return data;
}
