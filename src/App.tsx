import { useEffect, useState, createContext, useContext } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics, useBox, useSphere } from "@react-three/cannon";
import {
  OrbitControls,
  PerspectiveCamera,
  MeshTransmissionMaterial,
  Environment,
  PerformanceMonitor,
  MeshReflectorMaterial,
  Box,
  Sphere,
} from "@react-three/drei";
import { button, useControls } from "leva";
import * as Tone from "tone";
import { MeshRefType } from "./types";
import { Lightformers } from "./LightFormers";

enum SoundType {
  Sampler,
  Synth,
}

const debugConsts = {
  soundType: SoundType.Synth,
};

const Plane = (props: { size: [number, number] }) => {
  const { size } = props;
  const [ref] = useBox(() => ({
    args: [...size, 0.1],
    rotation: [-Math.PI / 2, 0, 0],
    ...props,
  }));
  return (
    <mesh receiveShadow ref={ref as MeshRefType}>
      <planeGeometry args={size} />
      <MeshReflectorMaterial
        // blur={[400, 100]}
        resolution={1024}
        mirror={1}
        // mixStrength={15}
        color="#edf0f7"
        metalness={0.6}
        roughness={0.8}
      />
      {/* <meshStandardMaterial color="#f0f0f0" /> */}
    </mesh>
  );
};

export const GlassCube = (props: { position: [number, number, number] }) => {
  const { onCollisionEvent } = useContext(Context);
  const [ref, api] = useBox(() => ({
    mass: 1,
    onCollide: onCollisionEvent,
    ...props,
  }));

  return (
    <Box
      castShadow
      ref={ref as MeshRefType}
      onClick={() => {
        api.applyImpulse([0, 5, 2], [0, -1, 0]);
      }}
    >
      {/* <boxGeometry /> */}
      <MeshTransmissionMaterial
        ior={1.2}
        thickness={1.5}
        anisotropy={0.1}
        chromaticAberration={0.8}
        distortionScale={0.5}
        temporalDistortion={0}
      />
    </Box>
  );
};

const GlassSphere = (props: { position: [number, number, number] }) => {
  const { onCollisionEvent } = useContext(Context);
  const [ref, api] = useSphere(() => ({
    mass: 1,
    onCollide: onCollisionEvent,
    ...props,
  }));
  return (
    <Sphere
      castShadow
      ref={ref as MeshRefType}
      onClick={() => {
        api.applyImpulse([0, 5, 2], [0, -1, 0]);
      }}
    >
      <sphereGeometry />
      <MeshTransmissionMaterial
        ior={1.2}
        thickness={1.5}
        anisotropy={0.1}
        chromaticAberration={0.04}
        distortionScale={0.5}
        temporalDistortion={0}
      />
    </Sphere>
  );
};

const hitSampler = new Tone.Sampler({
  urls: { C3: "hit.mp3" },
  baseUrl: "./sounds/",
}).toDestination();
const hitSynth = new Tone.MembraneSynth().toDestination();

export const Context = createContext({
  onCollisionEvent: (e: any) => {
    const instrument =
      debugConsts.soundType === SoundType.Sampler ? hitSampler : hitSynth;
    const velocity = e.contact.impactVelocity;
    // Scale the volume based on the velocity
    const gain = Math.min(velocity / 4, 1);
    // Set the volume
    instrument.volume.value = Tone.gainToDb(gain);

    console.log("impactVelocity, gain", velocity, gain);
    instrument.triggerAttack("C4");
  },
});

export default function App() {
  // Delayed instantiation of a cube
  const [ready, set] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => set(true), 1000);
    return () => clearTimeout(timeout);
  }, []);

  // Cube instantiation
  const [cubes, setCubes] = useState<{ position: [number, number, number] }[]>([
    { position: [0, 5, 0] },
  ]);
  const addCube = (position: [number, number, number]) => {
    setCubes((prevCubes) => [...prevCubes, { position }]);
  };

  // Sphere instantiation
  const [spheres, setSpheres] = useState<
    { position: [number, number, number] }[]
  >([{ position: [3, 5, 0] }]);
  const addSphere = (position: [number, number, number]) => {
    setSpheres((prevSpheres) => [...prevSpheres, { position }]);
  };

  // Degrade performance
  const [degraded, degrade] = useState(false);

  // Leva controls
  useControls({
    "Add Cube": button(() => addCube([Math.random(), 5, Math.random()])),
    "Add Sphere": button(() => addSphere([Math.random(), 5, Math.random()])),
    soundType: {
      value: debugConsts.soundType,
      options: {
        Sampler: SoundType.Sampler,
        Synth: SoundType.Synth,
      },
      onChange: (v) => (debugConsts.soundType = v),
    },
  });

  return (
    <Canvas shadows>
      <PerspectiveCamera makeDefault position={[0, 3, 15]} />
      <OrbitControls target={[0, 0, 0]} />
      <ambientLight intensity={0.8} />
      {/* <directionalLight
        color="greenyellow"
        position={[20, 20, 25]}
        castShadow
      /> */}
      <directionalLight color="plum" position={[-20, 10, 25]} />
      {/** PerfMon will detect performance issues */}
      <PerformanceMonitor onDecline={() => degrade(true)} />
      {/* Renders contents "live" into a HDRI environment (scene.environment). */}
      <Environment
        frames={degraded ? 1 : Infinity}
        resolution={256}
        background
        blur={1}
      >
        <Lightformers />
      </Environment>
      <Physics>
        <Plane size={[15, 15]} />
        {cubes.map((cube, i) => (
          <GlassCube key={i} position={cube.position} />
        ))}
        {spheres.map((sphere, i) => (
          <GlassSphere key={i} position={sphere.position} />
        ))}
        {ready && <GlassCube position={[-1, 5, 0.5]} />}
      </Physics>
    </Canvas>
  );
}
