import { SEED_USERS, SEED_PROJECTS, SEED_TASKS } from '../data/seed';
import type { User, Project, Task } from '../types/models';

// Storage keys
export const STORAGE_KEYS = {
  USERS: 'axionix_users',
  PROJECTS: 'axionix_projects',
  TASKS: 'axionix_tasks',
  CURRENT_USER: 'axionix_current_user',
  SIMULATE_ERROR: 'axionix_simulate_error',
} as const;

// Read environment defaults
const DEFAULT_DELAY_MS = Number(import.meta.env.VITE_API_DELAY_MS) || 500;
const DEFAULT_FAILURE_RATE = Number(import.meta.env.VITE_API_FAILURE_RATE) || 0;

// Runtime state for manual error simulation toggle (used in footer)
let isErrorSimulationManual = false;

// Initialize manual toggle state from storage if present
if (typeof window !== 'undefined') {
  try {
    isErrorSimulationManual = localStorage.getItem(STORAGE_KEYS.SIMULATE_ERROR) === 'true';
  } catch {
    isErrorSimulationManual = false;
  }
}

export const getSimulateErrorToggle = (): boolean => isErrorSimulationManual;

export const setSimulateErrorToggle = (enabled: boolean): void => {
  isErrorSimulationManual = enabled;
  try {
    localStorage.setItem(STORAGE_KEYS.SIMULATE_ERROR, String(enabled));
    // Dispatch custom event so listeners (e.g., footer UI) can sync reactively
    window.dispatchEvent(new CustomEvent('simulate-error-change', { detail: enabled }));
  } catch {
    // Ignore storage errors in restricted contexts
  }
};

/**
 * Initializes the localStorage database with seed data on the first load only.
 * Merges any newly added seed items so existing sessions automatically receive new sample records.
 */
export const initializeStorage = (): void => {
  if (typeof window === 'undefined') return;

  try {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS));
    } else {
      const currentUsers = getStoredItem<User[]>(STORAGE_KEYS.USERS, []);
      const userIds = new Set(currentUsers.map((u) => u.id));
      const missingUsers = SEED_USERS.filter((u) => !userIds.has(u.id));
      if (missingUsers.length > 0) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([...currentUsers, ...missingUsers]));
      }
    }

    if (!localStorage.getItem(STORAGE_KEYS.PROJECTS)) {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(SEED_PROJECTS));
    } else {
      const currentProjects = getStoredItem<Project[]>(STORAGE_KEYS.PROJECTS, []);
      const projectIds = new Set(currentProjects.map((p) => p.id));
      const missingProjects = SEED_PROJECTS.filter((p) => !projectIds.has(p.id));
      if (missingProjects.length > 0) {
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify([...currentProjects, ...missingProjects]));
      }
    }

    if (!localStorage.getItem(STORAGE_KEYS.TASKS)) {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(SEED_TASKS));
    } else {
      const currentTasks = getStoredItem<Task[]>(STORAGE_KEYS.TASKS, []);
      const taskIds = new Set(currentTasks.map((t) => t.id));
      const missingTasks = SEED_TASKS.filter((t) => !taskIds.has(t.id));
      if (missingTasks.length > 0) {
        localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify([...currentTasks, ...missingTasks]));
      }
    }
  } catch (error) {
    console.error('Failed to initialize local storage database:', error);
  }
};

/**
 * Resets database back to default seed data (useful for testing or demo resets).
 */
export const resetStorageToSeed = (): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS));
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(SEED_PROJECTS));
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(SEED_TASKS));
  } catch (error) {
    console.error('Failed to reset storage:', error);
  }
};

/**
 * Wraps an asynchronous operation with simulated network latency and random or manual failure.
 */
export async function simulateNetwork<T>(operation: () => T | Promise<T>): Promise<T> {
  const delayMs = DEFAULT_DELAY_MS;
  const failureRate = DEFAULT_FAILURE_RATE;

  // Add simulated latency
  await new Promise((resolve) => setTimeout(resolve, delayMs));

  // Determine whether to simulate an error
  const shouldFail = isErrorSimulationManual || Math.random() < failureRate;

  if (shouldFail) {
    throw new Error('Simulated API Failure: The server encountered an unexpected error. Try again.');
  }

  return operation();
}

/**
 * Generic safe JSON storage reader
 */
export function getStoredItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

/**
 * Generic safe JSON storage writer
 */
export function setStoredItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to write to localStorage key "${key}":`, error);
  }
}
