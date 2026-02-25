import { create } from 'zustand';
import type { UserRole } from '../data/users';

export interface AuthUser {
  id: number;
  username: string;
  displayName: string;
  role: UserRole;
}

interface AuthState {
  currentUser: AuthUser | null;
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const STORAGE_KEY = 'footballLineUp_auth';
const API_BASE = 'http://localhost:4000/api';

const loadFromStorage = (): AuthUser | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    // ignore
  }
  return null;
};

export const useAuthStore = create<AuthState>((set) => {
  const savedUser = loadFromStorage();
  return {
    currentUser: savedUser,
    isLoggedIn: !!savedUser,
    login: async (username: string, password: string) => {
      try {
        const res = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });
        if (!res.ok) return false;
        const data = await res.json();
        if (data.success && data.user) {
          const user: AuthUser = data.user;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
          set({ currentUser: user, isLoggedIn: true });
          return true;
        }
        return false;
      } catch {
        return false;
      }
    },
    logout: () => {
      localStorage.removeItem(STORAGE_KEY);
      set({ currentUser: null, isLoggedIn: false });
    },
  };
});
