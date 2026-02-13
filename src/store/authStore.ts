import { create } from 'zustand';
import { USERS } from '../data/users';
import type { User } from '../data/users';

interface AuthState {
  currentUser: User | null;
  isLoggedIn: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const STORAGE_KEY = 'footballLineUp_auth';

const loadFromStorage = (): User | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Verify the user still exists in our user list
      const user = USERS.find(u => u.username === parsed.username && u.password === parsed.password);
      return user || null;
    }
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
    login: (username: string, password: string) => {
      const user = USERS.find(u => u.username === username && u.password === password);
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ username: user.username, password: user.password }));
        set({ currentUser: user, isLoggedIn: true });
        return true;
      }
      return false;
    },
    logout: () => {
      localStorage.removeItem(STORAGE_KEY);
      set({ currentUser: null, isLoggedIn: false });
    },
  };
});
