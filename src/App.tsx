import { useEffect, useState, createContext, useContext } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics, useBox, useSphere } from "@react-three/cannon";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { button, useControls } from "leva";
import * as Tone from "tone";
import { MeshRefType } from "./types";

enum SoundType {
  Sampler,
  Synth,
}

const debugConsts = {
  soundType: SoundType.Sampler,
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
      <meshStandardMaterial color="#f0f0f0" />
    </mesh>
  );
};

export const Cube = (props: { position: [number, number, number] }) => {
  const { onCollisionEvent } = useContext(Context);
  const [ref] = useBox(() => ({
    mass: 1,
    onCollide: onCollisionEvent,
    ...props,
  }));

  return (
    <mesh castShadow ref={ref as MeshRefType}>
      <boxGeometry />
      <meshStandardMaterial color="ghostwhite" />
    </mesh>
  );
};

const Sphere = (props: { position: [number, number, number] }) => {
  const { onCollisionEvent } = useContext(Context);
  const [ref] = useSphere(() => ({
    mass: 1,
    onCollide: onCollisionEvent,
    ...props,
  }));
  return (
    <mesh castShadow ref={ref as MeshRefType}>
      <sphereGeometry />
      <meshStandardMaterial color="mistyrose" />
    </mesh>
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
    instrument.triggerAttack("C3");
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
  >([{ position: [0, 5, 0] }]);
  const addSphere = (position: [number, number, number]) => {
    setSpheres((prevSpheres) => [...prevSpheres, { position }]);
  };

  // Leva controls
  useControls({
    "Add Cube": button(() => addCube([0, 5, 0])),
    "Add Sphere": button(() => addSphere([0, 5, 0])),
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
      <ambientLight intensity={0.5} />
      <directionalLight
        color="greenyellow"
        position={[20, 20, 25]}
        castShadow
      />
      <directionalLight color="plum" position={[-20, 10, 25]} />
      <Physics>
        <Plane size={[15, 15]} />
        {cubes.map((cube, i) => (
          <Cube key={i} position={cube.position} />
        ))}
        {spheres.map((sphere, i) => (
          <Sphere key={i} position={sphere.position} />
        ))}
        {ready && <Cube position={[0, 5, 0]} />}
      </Physics>
    </Canvas>
  );
}
