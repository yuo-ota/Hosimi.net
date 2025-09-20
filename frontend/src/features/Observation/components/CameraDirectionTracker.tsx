import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

type CameraDirectionTrackerProps = {
  onDirectionChange: (direction: THREE.Vector3) => void;
};

const CameraDirectionTracker = ({ onDirectionChange }: CameraDirectionTrackerProps) => {
  const { camera } = useThree();

  useFrame(() => {
    // カメラの向いている方向ベクトルを取得
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    onDirectionChange(direction);
  });

  return null;
};

export default CameraDirectionTracker;