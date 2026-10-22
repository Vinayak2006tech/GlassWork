import { useAuthContext } from '../features/auth/authContextDef';

/**
 * Hook to access current authentication state and actions (login, logout, session state).
 */
export const useAuth = () => {
  return useAuthContext();
};
