import { useEffect, useState, createContext, useContext } from 'react'
import { Canvas } from '@react-three/fiber'
import { Physics, useBox, useSphere } from '@react-three/cannon'
import { CameraControls, PerspectiveCamera } from '@react-three/drei';
import { button, useControls } from "leva"
import * as Tone from 'tone';
import { MeshRefType } from './types';


const Plane = (props: { size: [number, number] }) => {
  const { size } = props;
  const [ref] = useBox(() => ({
    args: [...size, .1],
    rotation: [-Math.PI / 2, 0, 0],
    ...props
  }))
  return (
    <mesh receiveShadow ref={ref as MeshRefType}>
      <planeGeometry args={size} />
      <meshStandardMaterial color="#f0f0f0" />
    </mesh>
  )
}

export const Cube = (props: { position: [number, number, number] }) => {
  const { onCollisionEvent } = useContext(Context);
  const [ref] = useBox(() => ({ mass: 1, onCollide: onCollisionEvent,  ...props }))

  return (
    <mesh castShadow ref={ref as MeshRefType}>
      <boxGeometry />
      <meshStandardMaterial color="orange" />
    </mesh>
  )
}

const  Sphere = (props: { position: [number, number, number] }) => {
  const { onCollisionEvent } = useContext(Context);
  const [ref] = useSphere(() => ({ mass: 1, onCollide: onCollisionEvent, ...props }))
  return (
    <mesh castShadow ref={ref as MeshRefType}>
      <sphereGeometry />
      <meshStandardMaterial color="orange" />
    </mesh>
  )
}

  
const hitSampler = new Tone.Sampler({
    urls: { C3: "hit.mp3" },
    baseUrl: "./sounds/",
}).toDestination();
  
export const Context = createContext({
  onCollisionEvent: () => {
    console.log("onCollisionEvent");
    hitSampler.triggerAttack("C3");
  }
});

export default function App() {
  // Delayed instantiation of a cube
  const [ready, set] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => set(true), 1000)
    return () => clearTimeout(timeout)
  }, []);

  // Cube instantiation
  const [cubes, setCubes] = useState<{ position: [number, number, number] }[]>([
    { position: [0, 5, 0] },
  ]);
  const addCube = (position: [number, number, number]) => {
    setCubes((prevCubes) => [...prevCubes, { position }]);
  };

  // Sphere instantiation
  const [spheres, setSpheres] = useState<{ position: [number, number, number] }[]>([
    { position: [0, 5, 0] },
  ]);
  const addSphere = (position: [number, number, number]) => {
    setSpheres((prevSpheres) => [...prevSpheres, { position }]);
  };

  // Leva controls
  useControls({
    "Add Cube": button(() => addCube([0, 5, 0])),
    "Add Sphere": button(() => addSphere([0, 5, 0])),
  });

  return (
      <Canvas shadows >
        {/* <PerspectiveCamera makeDefault position={[0, 5, 5]} /> */}
        <CameraControls />
        <ambientLight />
        <directionalLight color="yellow" position={[10, 10, 5]} castShadow />
        <Physics>
          <Plane size={[25,25]} />
          {cubes.map((cube, i) => (
            <Cube key={i} position={cube.position} />
          ))}
          {spheres.map((sphere, i) => (
            <Sphere key={i} position={sphere.position} />
          ))}
          {ready && <Cube position={[0, 5, 0]} />}
        </Physics>
      </Canvas>
  )
}
