import { Mesh, BufferGeometry, Material } from "three";

// Types
export type MeshRefType = React.MutableRefObject<
  Mesh<BufferGeometry, Material | Material[]>
>;

export type ContextType = {
  onCollisionEvent: () => void;
};
