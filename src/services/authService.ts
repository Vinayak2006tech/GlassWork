import { User } from '../types/models';
import {
  simulateNetwork,
  getStoredItem,
  setStoredItem,
  STORAGE_KEYS,
  initializeStorage,
} from './api';

// Demo credentials specified in requirements
export const DEMO_CREDENTIALS = {
  email: 'demo@axionix.dev',
  password: 'Demo@1234',
};

export const authService = {
  /**
   * Authenticates user using email and password.
   */
  async login(email: string, password: string): Promise<User> {
    initializeStorage();
    return simulateNetwork(() => {
      const normalizedEmail = email.trim().toLowerCase();

      // Check valid demo credentials
      if (
        normalizedEmail !== DEMO_CREDENTIALS.email.toLowerCase() ||
        password !== DEMO_CREDENTIALS.password
      ) {
        throw new Error('Invalid email or password. Please use the demo credentials.');
      }

      // Fetch user from users store
      const users = getStoredItem<User[]>(STORAGE_KEYS.USERS, []);
      const user =
        users.find((u) => u.email.toLowerCase() === normalizedEmail) || {
          id: 'user-1',
          name: 'Alex Rivera',
          email: 'demo@axionix.dev',
          avatarUrl:
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          role: 'Tech Lead',
        };

      // Persist authenticated session
      setStoredItem(STORAGE_KEYS.CURRENT_USER, user);
      return user;
    });
  },

  /**
   * Restores existing session from storage asynchronously with network simulation.
   */
  async getCurrentUser(): Promise<User | null> {
    initializeStorage();
    return simulateNetwork(() => {
      return getStoredItem<User | null>(STORAGE_KEYS.CURRENT_USER, null);
    });
  },

  /**
   * Clears session from storage.
   */
  async logout(): Promise<void> {
    return simulateNetwork(() => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      }
    });
  },

  /**
   * Synchronous check for fast initial rendering check.
   */
  getSessionUserSync(): User | null {
    return getStoredItem<User | null>(STORAGE_KEYS.CURRENT_USER, null);
  },
};
