import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Stars, Sparkles, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';

// Road component
function Road() {
  return (
    <group>
      {/* Main horizontal road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[60, 10]} />
        <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.8} />
      </mesh>
      {/* Main vertical road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[10, 60]} />
        <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.8} />
      </mesh>
      {/* Road markings - horizontal */}
      {[-1, 1].map((offset) => (
        <mesh key={`h-${offset}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, offset * 2]}>
          <planeGeometry args={[58, 0.15]} />
          <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={0.8} toneMapped={false} />
        </mesh>
      ))}
      {/* Road markings - vertical */}
      {[-1, 1].map((offset) => (
        <mesh key={`v-${offset}`} rotation={[-Math.PI / 2, 0, 0]} position={[offset * 2, 0.02, 0]}>
          <planeGeometry args={[0.15, 58]} />
          <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={0.8} toneMapped={false} />
        </mesh>
      ))}

      {/* Crosswalks */}
      <group>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[6, 0.03, 0]}>
          <planeGeometry args={[2, 10]} />
          <meshStandardMaterial color="#ffffff" opacity={0.1} transparent />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-6, 0.03, 0]}>
          <planeGeometry args={[2, 10]} />
          <meshStandardMaterial color="#ffffff" opacity={0.1} transparent />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 6]}>
          <planeGeometry args={[10, 2]} />
          <meshStandardMaterial color="#ffffff" opacity={0.1} transparent />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, -6]}>
          <planeGeometry args={[10, 2]} />
          <meshStandardMaterial color="#ffffff" opacity={0.1} transparent />
        </mesh>
      </group>
    </group>
  );
}

// Traffic light component
function TrafficLight({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  const lightRef = useRef<THREE.PointLight>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    const phase = Math.floor(time / 3) % 3;

    if (lightRef.current && meshRef.current) {
      const colors = ['#ff3366', '#ffaa00', '#00ff88'];
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      material.emissive.set(colors[phase]);
      material.emissiveIntensity = 3;
      lightRef.current.color.set(colors[phase]);
    }
  });

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Pole */}
      <mesh position={[0, 2.5, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 5]} />
        <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Light box */}
      <mesh position={[0, 5, 0]} ref={meshRef}>
        <boxGeometry args={[0.6, 1.5, 0.6]} />
        <meshStandardMaterial color="#000000" emissive="#00ff88" emissiveIntensity={2} toneMapped={false} />
      </mesh>
      <pointLight ref={lightRef} position={[0, 5, 0.8]} intensity={3} distance={15} color="#00ff88" />
    </group>
  );
}

// Animated vehicle
function Vehicle({
  initialPosition,
  direction,
  type = 'car',
  color = '#00f0ff'
}: {
  initialPosition: [number, number, number];
  direction: 'x' | 'z';
  type?: 'car' | 'truck';
  color?: string;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const speed = useMemo(() => 0.03 + Math.random() * 0.04, []);
  const startOffset = useMemo(() => Math.random() * 60 - 30, []);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const time = clock.getElapsedTime() * speed * 50 + startOffset;
      const pos = ((time % 60) - 30);

      if (direction === 'x') {
        meshRef.current.position.x = pos;
        meshRef.current.rotation.y = Math.PI / 2;
      } else {
        meshRef.current.position.z = pos;
      }
    }
  });

  const size = type === 'truck' ? [2.5, 1.2, 1.2] : [1.8, 0.6, 0.9];
  const geometry = type === 'truck' ? new THREE.BoxGeometry(size[0], size[1], size[2]) : new THREE.BoxGeometry(size[0], size[1], size[2]);

  return (
    <group ref={meshRef} position={initialPosition}>
      {/* Vehicle body */}
      <mesh position={[0, size[1] / 2, 0]}>
        <primitive object={geometry} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          metalness={0.9}
          roughness={0.1}
          toneMapped={false}
        />
      </mesh>
      {/* Headlights */}
      <pointLight position={[size[0] / 2 + 0.2, 0.5, 0.3]} intensity={1} distance={8} color="#ffffff" />
      <pointLight position={[size[0] / 2 + 0.2, 0.5, -0.3]} intensity={1} distance={8} color="#ffffff" />

      {/* Tail lights */}
      <mesh position={[-size[0] / 2 - 0.05, 0.5, 0.3]}>
        <boxGeometry args={[0.05, 0.2, 0.2]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={2} toneMapped={false} />
      </mesh>
      <mesh position={[-size[0] / 2 - 0.05, 0.5, -0.3]}>
        <boxGeometry args={[0.05, 0.2, 0.2]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={2} toneMapped={false} />
      </mesh>
    </group>
  );
}

// Buildings
function Buildings() {
  const buildings = useMemo(() => {
    const result = [];
    // City block layout
    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 10 + Math.random() * 30;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      // Avoid roads
      if (Math.abs(x) < 6 || Math.abs(z) < 6) continue;

      const height = 5 + Math.random() * 15 + (40 - radius) * 0.5;
      const width = 2 + Math.random() * 4;
      result.push({ x, z, height, width });
    }
    return result;
  }, []);

  return (
    <group>
      {buildings.map((b, i) => (
        <group key={i} position={[b.x, b.height / 2, b.z]}>
          <mesh>
            <boxGeometry args={[b.width, b.height, b.width]} />
            <meshStandardMaterial
              color="#020617"
              emissive="#38bdf8"
              emissiveIntensity={0.05 + Math.random() * 0.1}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
          {/* Cyberpunk details - glowing lines */}
          {Math.random() > 0.5 && (
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[b.width + 0.05, b.height * 0.8, b.width + 0.05]} />
              <meshBasicMaterial wireframe color="#38bdf8" transparent opacity={0.05} />
            </mesh>
          )}
          {/* Top light */}
          <pointLight
            position={[0, b.height / 2 + 0.5, 0]}
            color="#00f0ff"
            intensity={0.2}
            distance={5}
          />
        </group>
      ))}
    </group>
  );
}

// Main scene component
function Scene() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Very slow rotation of the city container
      groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.05) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Sparkles count={200} scale={[40, 40, 40]} size={2} speed={0.4} opacity={0.5} color="#00f0ff" />

      <Road />
      <Buildings />

      {/* Traffic lights at intersection corners */}
      <TrafficLight position={[6, 0, 6]} rotation={Math.PI * 1.25} />
      <TrafficLight position={[-6, 0, 6]} rotation={Math.PI * 0.75} />
      <TrafficLight position={[6, 0, -6]} rotation={Math.PI * 1.75} />
      <TrafficLight position={[-6, 0, -6]} rotation={Math.PI * 0.25} />

      {/* Random traffic generation */}
      {Array.from({ length: 15 }).map((_, i) => {
        const isX = Math.random() > 0.5;
        const lane = (Math.random() > 0.5 ? 1 : -1) * (isX ? 2 : 2); // 2 is lane offset
        const startPos = [isX ? 0 : lane, 0, isX ? lane : 0] as [number, number, number];
        return (
          <Vehicle
            key={i}
            initialPosition={startPos}
            direction={isX ? 'x' : 'z'}
            color={Math.random() > 0.8 ? '#ff3366' : '#00f0ff'}
            type={Math.random() > 0.8 ? 'truck' : 'car'}
          />
        );
      })}

      {/* Lighting */}
      <ambientLight intensity={0.1} />
      <directionalLight position={[10, 20, 10]} intensity={0.5} color="#38bdf8" />
      <pointLight position={[0, 15, 0]} intensity={1} color="#38bdf8" distance={50} />

      {/* Shadows */}
      <ContactShadows resolution={1024} scale={100} blur={2} opacity={0.5} far={10} color="#000000" />
    </group>
  );
}

interface CitySceneProps {
  className?: string;
}

export default function CityScene({ className }: CitySceneProps) {
  return (
    <div className={className}>
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[30, 25, 30]} fov={45} />
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={Math.PI / 4}
        />
        <Environment preset="city" />
        <Scene />
        <EffectComposer disableNormalPass>
          <Bloom luminanceThreshold={1} intensity={1.5} radius={0.4} />
          <Vignette darkness={1.1} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
