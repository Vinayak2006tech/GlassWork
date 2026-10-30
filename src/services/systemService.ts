import {
  getSimulateErrorToggle,
  setSimulateErrorToggle,
  resetStorageToSeed,
} from './api';

/**
 * High-level system and configuration service.
 * Encapsulates runtime error simulation toggles and demo data reset operations
 * behind the service layer so UI components never touch storage or internal flags.
 */
export const systemService = {
  /**
   * Returns whether the simulated network failure mode is currently active.
   */
  isSimulateErrorActive(): boolean {
    return getSimulateErrorToggle();
  },

  /**
   * Sets whether the simulated network failure mode is active.
   */
  setSimulateError(enabled: boolean): void {
    setSimulateErrorToggle(enabled);
  },

  /**
   * Resets all workspace data (users, projects, tasks) back to initial seed data.
   */
  resetWorkspaceData(): void {
    resetStorageToSeed();
  },
};
