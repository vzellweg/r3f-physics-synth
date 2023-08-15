import { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Physics, usePlane, useBox, useSphere } from '@react-three/cannon'
import { Mesh, BufferGeometry, Material } from 'three'
import { CameraControls, PerspectiveCamera } from '@react-three/drei';
import { button, useControls } from "leva"

type MeshRefType = React.MutableRefObject<Mesh<BufferGeometry, Material | Material[]>>;

function Plane(props: { size: [number, number] }) {
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

function Cube(props: any) {
  const [ref] = useBox(() => ({ mass: 1, ...props }))
  return (
    <mesh castShadow ref={ref as MeshRefType}>
      <boxGeometry />
      <meshStandardMaterial color="orange" />
    </mesh>
  )
}

function Sphere(props: { position: [number, number, number] }) {
  const [ref] = useSphere(() => ({ mass: 1, ...props }))
  return (
    <mesh castShadow ref={ref as MeshRefType}>
      <sphereGeometry />
      <meshStandardMaterial color="orange" />
    </mesh>
  )
}



export default function App() {
  const [ready, set] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => set(true), 10000)
    return () => clearTimeout(timeout)
  }, [])

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
        <Cube position={[0, 5, 0]} />
        <Cube position={[0.45, 7, -0.25]} />
        <Cube position={[-0.45, 9, 0.25]} />
        {ready && <Cube position={[-0.45, 10, 0.25]} />}
      </Physics>
    </Canvas>
  )
}
