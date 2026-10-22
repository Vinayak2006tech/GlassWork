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
        saturation={1}
        brightness={1.5}
        contrast={1}
        speed={2.35}
        scale={1}
        detail={8}
        warp={1}
        rotation={0}
        mouseReact={true}
        amplitude={0.1}
        stir={0.5}
        sheen={0.3}
        clickSwirl={true}
        grain={0}
        fade={0}
        opacity={0.85}
      />
    </div>
  );
};

export default GlobalIridescenceBackground;
