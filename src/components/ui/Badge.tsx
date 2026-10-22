import React from 'react';
import {
  Circle,
  Clock,
  CheckCircle2,
  ArrowUp,
  ArrowRight,
  ArrowDown,
  AlertCircle,
} from 'lucide-react';
import { TaskPriority, TaskStatus } from '../../types/models';

interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'default' | 'status' | 'priority' | 'overdue' | 'dueSoon';
  status?: TaskStatus;
  priority?: TaskPriority;
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  status,
  priority,
  className = '',
  size = 'md',
}) => {
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs gap-1' : 'px-2.5 py-1 text-xs gap-1.5';

  if (variant === 'status' && status) {
    if (status === 'TODO') {
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full bg-slate-100 text-slate-700 border border-slate-200/80 ${sizeClass} ${className}`}
        >
          <Circle className="w-3 h-3 text-slate-500" aria-hidden="true" />
          <span>To Do</span>
        </span>
      );
    }
    if (status === 'IN_PROGRESS') {
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 ${sizeClass} ${className}`}
        >
          <Clock className="w-3 h-3 text-amber-600 animate-pulse" aria-hidden="true" />
          <span>In Progress</span>
        </span>
      );
    }
    if (status === 'DONE') {
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 ${sizeClass} ${className}`}
        >
          <CheckCircle2 className="w-3 h-3 text-emerald-600" aria-hidden="true" />
          <span>Done</span>
        </span>
      );
    }
  }

  if (variant === 'priority' && priority) {
    if (priority === 'HIGH') {
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full bg-rose-50 text-rose-700 border border-rose-200/80 ${sizeClass} ${className}`}
        >
          <ArrowUp className="w-3 h-3 text-rose-600" aria-hidden="true" />
          <span>High</span>
        </span>
      );
    }
    if (priority === 'MEDIUM') {
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 ${sizeClass} ${className}`}
        >
          <ArrowRight className="w-3 h-3 text-amber-600" aria-hidden="true" />
          <span>Medium</span>
        </span>
      );
    }
    if (priority === 'LOW') {
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full bg-sky-50 text-sky-700 border border-sky-200/80 ${sizeClass} ${className}`}
        >
          <ArrowDown className="w-3 h-3 text-sky-600" aria-hidden="true" />
          <span>Low</span>
        </span>
      );
    }
  }

  if (variant === 'overdue') {
    return (
      <span
        className={`inline-flex items-center font-medium rounded-full bg-rose-100 text-rose-800 border border-rose-300 ${sizeClass} ${className}`}
      >
        <AlertCircle className="w-3 h-3 text-rose-600" aria-hidden="true" />
        <span>{children || 'Overdue'}</span>
      </span>
    );
  }

  if (variant === 'dueSoon') {
    return (
      <span
        className={`inline-flex items-center font-medium rounded-full bg-amber-100 text-amber-800 border border-amber-300 ${sizeClass} ${className}`}
      >
        <Clock className="w-3 h-3 text-amber-600" aria-hidden="true" />
        <span>{children || 'Due Soon'}</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full bg-slate-100 text-slate-700 border border-slate-200 ${sizeClass} ${className}`}
    >
      {children}
    </span>
  );
};
