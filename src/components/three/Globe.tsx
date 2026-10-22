import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

export const Globe: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);

  // Generate team node points on a sphere
  const points = useMemo(() => {
    const pts: [number, number, number][] = [];
    const count = 30;
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      const radius = 1.6;
      pts.push([
        radius * Math.cos(theta) * Math.sin(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(phi),
      ]);
    }
    return pts;
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.5}>
      <group ref={groupRef}>
        {/* Wireframe outer sphere */}
        <mesh>
          <sphereGeometry args={[1.6, 20, 20]} />
          <meshStandardMaterial
            color="#818cf8"
            wireframe
            transparent
            opacity={0.15}
          />
        </mesh>

        {/* Inner glowing sphere */}
        <mesh>
          <sphereGeometry args={[1.3, 32, 32]} />
          <meshStandardMaterial
            color="#4338ca"
            roughness={0.4}
            metalness={0.8}
            transparent
            opacity={0.8}
          />
        </mesh>

        {/* Team glowing nodes */}
        {points.map((pt, idx) => (
          <mesh key={idx} position={pt}>
            <sphereGeometry args={[0.045, 12, 12]} />
            <meshBasicMaterial color={idx % 3 === 0 ? '#38bdf8' : '#a855f7'} />
          </mesh>
        ))}
      </group>
    </Float>
  );
};
