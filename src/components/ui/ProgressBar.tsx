import React from 'react';

interface ProgressBarProps {
  value: number; // 0 to 100
  total?: number;
  completed?: number;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  total,
  completed,
  showText = true,
  size = 'md',
  className = '',
  label = 'Task Completion Progress',
}) => {
  const clampedValue = Math.min(100, Math.max(0, Math.round(value)));

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  }[size];

  const displayText =
    completed !== undefined && total !== undefined
      ? `${completed} of ${total} done (${clampedValue}%)`
      : `${clampedValue}% completed`;

  return (
    <div className={`w-full ${className}`}>
      {showText && (
        <div className="flex justify-between items-center text-xs font-medium text-slate-600 mb-1.5">
          <span>{label}</span>
          <span className="font-semibold text-slate-800">{displayText}</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        className={`w-full bg-slate-200 rounded-full overflow-hidden ${heightClasses}`}
      >
        <div
          className="bg-indigo-600 h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
};
