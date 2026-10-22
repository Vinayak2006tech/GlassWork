import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  className = '',
  label = 'Loading...',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-10 h-10 border-3',
  }[size];

  return (
    <div
      role="status"
      aria-live="polite"
      className={`inline-flex items-center justify-center ${className}`}
    >
      <div
        className={`${sizeClasses} rounded-full border-indigo-200 border-t-indigo-600 animate-spin`}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
};
