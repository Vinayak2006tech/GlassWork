import React, { Suspense, lazy, useState, useEffect } from 'react';
import { ReducedMotionFallback } from './ReducedMotionFallback';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

// Lazy load Scene3D so Three.js bundle is loaded asynchronously
const LazyScene3D = lazy(() => import('./Scene3D'));

interface HeroSceneProps {
  variant: 'login' | 'dashboard' | 'notfound';
  className?: string;
}

// Helper to check WebGL support safely
function isWebGLAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

class ThreeErrorBoundary extends React.Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { fallback: React.ReactNode; children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.warn('Three.js scene encountered an error, gracefully falling back to static visual:', error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export const HeroScene: React.FC<HeroSceneProps> = ({ variant, className = '' }) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);

  useEffect(() => {
    setHasWebGL(isWebGLAvailable());
  }, []);

  // Gracefully degrade to static gradient/illustration if reduced motion is preferred or WebGL is missing
  if (prefersReducedMotion || !hasWebGL) {
    return <ReducedMotionFallback variant={variant} className={className} />;
  }

  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden pointer-events-none select-none ${className}`}
    >
      <ThreeErrorBoundary fallback={<ReducedMotionFallback variant={variant} className={className} />}>
        <Suspense fallback={<ReducedMotionFallback variant={variant} className={className} />}>
          <LazyScene3D variant={variant} />
        </Suspense>
      </ThreeErrorBoundary>
    </div>
  );
};

export default HeroScene;
