import React from 'react';
import { GlassCard } from './GlassCard';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  subtitle?: string;
  trend?: string;
  badge?: React.ReactNode;
  className?: string;
  iconBgColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  subtitle,
  badge,
  className = '',
  iconBgColor = 'bg-indigo-50 text-indigo-600',
}) => {
  return (
    <GlassCard className={`flex flex-col justify-between ${className}`} hoverEffect>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        <div className={`p-2 rounded-lg ${iconBgColor}`}>{icon}</div>
      </div>
      <div>
        <div className="text-2xl font-bold tracking-tight text-slate-900">{value}</div>
        {(subtitle || badge) && (
          <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
            {subtitle && <span>{subtitle}</span>}
            {badge && <div>{badge}</div>}
          </div>
        )}
      </div>
    </GlassCard>
  );
};
