// src/context/AuthContext.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Global authentication state stored in React Context.
// JWT token is persisted in localStorage for page reload persistence.

import React, { createContext, useCallback, useContext, useState } from 'react';
import type { AuthUser, TokenResponse } from '../types';

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  setSession: (response: TokenResponse) => void;
  clearSession: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const USER_KEY  = 'portal_user';
const TOKEN_KEY = 'access_token';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user,  setUser]  = useState<AuthUser | null>(() => {
    const raw = localStorage.getItem(USER_KEY);
    try { return raw ? (JSON.parse(raw) as AuthUser) : null; }
    catch { return null; }
  });

  // Persist both token and user profile to localStorage
  const setSession = useCallback((response: TokenResponse) => {
    const profile: AuthUser = {
      user_id:    response.user_id,
      student_id: '', // Not returned in token response — omit
      role:       response.role,
      full_name:  response.full_name,
      department: response.department,
      year:       response.year,
    };
    localStorage.setItem(TOKEN_KEY, response.access_token);
    localStorage.setItem(USER_KEY,  JSON.stringify(profile));
    setToken(response.access_token);
    setUser(profile);
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated: !!token, setSession, clearSession }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
