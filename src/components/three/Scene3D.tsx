import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { FloatingShape } from './FloatingShape';
import { Globe } from './Globe';

interface Scene3DProps {
  variant: 'login' | 'dashboard' | 'notfound';
}

export const Scene3D: React.FC<Scene3DProps> = ({ variant }) => {
  const [isDocumentVisible, setIsDocumentVisible] = useState(true);

  // Pause render loop if tab is backgrounded
  useEffect(() => {
    const handleVisibility = () => {
      setIsDocumentVisible(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="w-full h-full pointer-events-none select-none relative overflow-hidden"
    >
      <Canvas
        frameloop={isDocumentVisible ? 'always' : 'never'}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ powerPreference: 'low-power', antialias: true }}
        style={{ pointerEvents: 'none' }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} />
        <pointLight position={[-5, -5, -2]} intensity={0.5} color="#818cf8" />
        <pointLight position={[5, -2, 2]} intensity={0.8} color="#c084fc" />

        {variant === 'login' && (
          <>
            <group position={[-1.2, 0.4, 0]}>
              <FloatingShape
                geometryType="torusKnot"
                color="#6366f1"
                speed={1.4}
                distort={0.25}
              />
            </group>
            <group position={[1.4, -0.2, -0.5]}>
              <Globe />
            </group>
          </>
        )}

        {variant === 'dashboard' && (
          <>
            <group position={[-2.5, 0, 0]}>
              <FloatingShape
                geometryType="icosahedron"
                color="#818cf8"
                speed={1.0}
                distort={0.2}
              />
            </group>
            <group position={[2.5, 0, 0]}>
              <FloatingShape
                geometryType="torusKnot"
                color="#a855f7"
                speed={1.2}
                distort={0.3}
              />
            </group>
          </>
        )}

        {variant === 'notfound' && (
          <FloatingShape
            geometryType="icosahedron"
            color="#ec4899"
            speed={1.8}
            distort={0.45}
          />
        )}
      </Canvas>
    </div>
  );
};

export default Scene3D;
