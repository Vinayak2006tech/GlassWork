import React from 'react';
import { Iridescence } from '../ui/Iridescence';

export const GlobalIridescenceBackground: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none transition-opacity duration-700"
    >
      <Iridescence
        color="#8099cc"
        hueShift={0}
        saturation={0.9}
        brightness={1.3}
        contrast={1}
        speed={0.6}
        scale={1.2}
        detail={4}
        warp={0.8}
        rotation={0}
        mouseReact={false}
        amplitude={0.05}
        stir={0}
        sheen={0.2}
        clickSwirl={false}
        grain={0}
        fade={0}
        opacity={0.65}
        resolution={0.55}
      />

    </div>
  );
};

export default GlobalIridescenceBackground;
