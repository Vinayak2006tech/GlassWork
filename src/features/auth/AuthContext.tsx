import React, { useEffect, useState, useCallback } from 'react';
import { User } from '../../types/models';
import { authService } from '../../services/authService';
import { AuthContext, AuthContextType } from './authContextDef';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isRestoringSession, setIsRestoringSession] = useState<boolean>(true);

  // Restore authenticated session on initial mount
  useEffect(() => {
    let isMounted = true;

    async function restore() {
      try {
        const restoredUser = await authService.getCurrentUser();
        if (isMounted) {
          setUser(restoredUser);
        }
      } catch (err) {
        console.error('Session restoration failed:', err);
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsRestoringSession(false);
        }
      }
    }

    restore();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const authenticatedUser = await authService.login(email, password);
    setUser(authenticatedUser);
    return authenticatedUser;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
    }
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: Boolean(user),
    isRestoringSession,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
