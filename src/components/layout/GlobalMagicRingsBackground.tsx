import React from 'react';
import { MagicRings } from '../ui/MagicRings';

export const GlobalMagicRingsBackground: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none transition-opacity duration-700"
    >
      <MagicRings
        color="#818cf8"
        colorTwo="#6366f1"
        ringCount={6}
        motion="pulse"
        speed={0.8}
        lineThickness={1.8}
        glow={1.2}
        baseRadius={0.32}
        radiusStep={0.08}
        expansion={0.08}
        taper={1.4}
        rotation={0}
        tilt={12}
        dispersion={0.15}
        grain={0}
        opacity={0.6}
        followMouse={true}
        mouseInfluence={0.12}
        hoverScale={1.15}
        hoverIntensity={0.8}
        parallax={0.04}
        clickBurst={true}
        intro={true}
        theme="light"
      />
    </div>
  );
};

export default GlobalMagicRingsBackground;
