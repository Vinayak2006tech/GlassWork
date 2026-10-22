import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Spinner } from '../../components/ui/Spinner';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isRestoringSession } = useAuth();
  const location = useLocation();

  if (isRestoringSession) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center relative z-10 gap-4"
        role="status"
        aria-live="polite"
      >
        <div className="glass-panel-opaque p-8 rounded-3xl shadow-xl flex flex-col items-center gap-4 border border-white/80">
          <Spinner size="lg" label="Restoring your session..." />
          <p className="text-sm font-semibold text-slate-700 animate-pulse">
            Restoring your session...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
