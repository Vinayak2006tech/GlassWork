import React from 'react';
import { DitherVeil } from '../ui/DitherVeil';

export const GlobalDitherBackground: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 overflow-hidden pointer-events-auto opacity-30 select-none transition-opacity duration-700"
    >
      <DitherVeil
        src="https://images.unsplash.com/photo-1737071371043-761e02b1ef95?q=80&w=1400&auto=format&fit=crop"
        pattern="floyd"
        pixelSize={3}
        inkColor="#312e81"
        paperColor="#f8fafc"
        rimColor="#818cf8"
        rim={0.15}
        revealRadius={240}
        softness={0.6}
        linger={1.5}
        wander={true}
        clickBurst={true}
        fit="cover"
      />
    </div>
  );
};
