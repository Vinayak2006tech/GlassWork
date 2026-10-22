import { createContext, useContext } from 'react';
import { User } from '../../types/models';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isRestoringSession: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
