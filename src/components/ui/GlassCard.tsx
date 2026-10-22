import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  hoverEffect = false,
  ...props
}) => {
  return (
    <div
      className={`glass-card rounded-xl p-5 ${
        hoverEffect ? 'glass-card-hover' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
