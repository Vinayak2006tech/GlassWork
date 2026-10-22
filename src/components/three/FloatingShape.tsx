import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface FloatingShapeProps {
  position?: [number, number, number];
  color?: string;
  speed?: number;
  distort?: number;
  geometryType?: 'icosahedron' | 'torusKnot' | 'sphere';
}

export const FloatingShape: React.FC<FloatingShapeProps> = ({
  position = [0, 0, 0],
  color = '#6366f1',
  speed = 1.5,
  distort = 0.3,
  geometryType = 'torusKnot',
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.25;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={0.6} floatIntensity={0.8} position={position}>
      <mesh ref={meshRef}>
        {geometryType === 'torusKnot' && <torusKnotGeometry args={[1, 0.35, 128, 32]} />}
        {geometryType === 'icosahedron' && <icosahedronGeometry args={[1.2, 1]} />}
        {geometryType === 'sphere' && <sphereGeometry args={[1.1, 32, 32]} />}
        <MeshDistortMaterial
          color={color}
          roughness={0.2}
          metalness={0.6}
          distort={distort}
          speed={speed}
        />
      </mesh>
    </Float>
  );
};
