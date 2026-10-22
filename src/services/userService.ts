import { User } from '../types/models';
import {
  simulateNetwork,
  getStoredItem,
  STORAGE_KEYS,
  initializeStorage,
} from './api';

export const userService = {
  /**
   * Fetches all users from storage.
   */
  async getUsers(): Promise<User[]> {
    initializeStorage();
    return simulateNetwork(() => {
      return getStoredItem<User[]>(STORAGE_KEYS.USERS, []);
    });
  },

  /**
   * Fetches a single user by ID.
   */
  async getUserById(id: string): Promise<User | null> {
    initializeStorage();
    return simulateNetwork(() => {
      const users = getStoredItem<User[]>(STORAGE_KEYS.USERS, []);
      return users.find((u) => u.id === id) || null;
    });
  },
};
