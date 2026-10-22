import React from 'react';
import { FallbackProps } from 'react-error-boundary';
import { AlertOctagon, RotateCcw } from 'lucide-react';
import { Button } from '../ui/Button';

export const ErrorBoundaryFallback: React.FC<FallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  return (
    <div
      role="alert"
      className="min-h-screen flex flex-col items-center justify-center p-6 relative z-10 text-center"
    >
      <div className="glass-panel-opaque p-8 rounded-3xl shadow-2xl border border-white/80 max-w-lg flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4 shadow-sm">
          <AlertOctagon className="w-8 h-8" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Application Error
        </h1>
        <p className="mt-2 text-sm text-slate-600 max-w-md">
          An unexpected application crash was caught by the boundary. You can retry the
          operation or reload the page.
        </p>

        {error?.message && (
          <pre className="mt-4 p-3 bg-white/70 rounded-xl text-xs font-mono text-slate-700 max-w-lg overflow-x-auto text-left border border-slate-200">
            {error.message}
          </pre>
        )}

        <div className="mt-6 flex gap-3">
          <Button
            variant="primary"
            onClick={() => {
              resetErrorBoundary();
              window.location.reload();
            }}
            leftIcon={<RotateCcw className="w-4 h-4" />}
          >
            Reload Application
          </Button>
        </div>
      </div>
    </div>
  );
};
