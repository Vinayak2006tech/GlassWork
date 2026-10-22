import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface ErrorMessageProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
  isRetrying?: boolean;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'Something went wrong',
  message = 'Failed to load data. The service might be temporarily unavailable.',
  onRetry,
  className = '',
  isRetrying = false,
}) => {
  return (
    <div
      role="alert"
      className={`rounded-xl border border-rose-200 bg-rose-50/80 p-5 text-rose-900 ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="p-1 rounded-md bg-rose-100 text-rose-600 shrink-0">
          <AlertTriangle className="w-5 h-5" aria-hidden="true" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-rose-800">{title}</h3>
          <p className="mt-1 text-xs text-rose-700">{message}</p>
          {onRetry && (
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                isLoading={isRetrying}
                leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                className="bg-white hover:bg-rose-50 border-rose-300 text-rose-700"
              >
                Retry
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
