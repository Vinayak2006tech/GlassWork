import React from 'react';
import { ReducedMotionFallback } from './ReducedMotionFallback';

interface HeroSceneProps {
  variant: 'login' | 'dashboard' | 'notfound';
  className?: string;
}

/**
 * Pure 2D modern glassmorphism illustration wrapper with zero 3D overhead.
 */
export const HeroScene: React.FC<HeroSceneProps> = ({ variant, className = '' }) => {
  return <ReducedMotionFallback variant={variant} className={className} />;
};

export default HeroScene;
