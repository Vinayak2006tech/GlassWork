import React from 'react';
import { Iridescence } from '../ui/Iridescence';

export const GlobalIridescenceBackground: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none opacity-35 select-none transition-opacity duration-700"
    >
      <Iridescence
        color="#8099cc"
        hueShift={0}
        saturation={1}
        brightness={1.4}
        contrast={1}
        speed={1.6}
        scale={1.1}
        detail={8}
        warp={1}
        rotation={0}
        mouseReact={true}
        amplitude={0.1}
        stir={0.45}
        sheen={0.3}
        clickSwirl={true}
        grain={0}
        fade={0}
      />
    </div>
  );
};

export default GlobalIridescenceBackground;
