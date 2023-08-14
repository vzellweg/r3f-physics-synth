import { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Physics, usePlane, useBox } from '@react-three/cannon'
import { Mesh, BufferGeometry, Material } from 'three'
import { PerspectiveCamera } from '@react-three/drei';

type MeshRefType = React.MutableRefObject<Mesh<BufferGeometry, Material | Material[]>>;

function Plane(props: any) {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }))
  return (
    <mesh receiveShadow ref={ref as MeshRefType}>
      <planeGeometry args={[1000, 1000]} />
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

export default function App() {
  const [ready, set] = useState(false)
  useEffect(() => {
    const timeout = setTimeout(() => set(true), 1000)
    return () => clearTimeout(timeout)
  }, [])
  return (
    <Canvas shadows >
      {/* <PerspectiveCamera makeDefault position={[0, 5, 5]} /> */}
      <ambientLight />
      <directionalLight color="yellow" position={[10, 10, 5]} castShadow />
      <Physics>
        <Plane />
        <Cube position={[0, 5, 0]} />
        <Cube position={[0.45, 7, -0.25]} />
        <Cube position={[-0.45, 9, 0.25]} />
        {ready && <Cube position={[-0.45, 10, 0.25]} />}
      </Physics>
    </Canvas>
  )
}
