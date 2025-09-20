'use client';

import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useEffect, useState } from "react";

const CameraMoveControls = () => {
  const { camera } = useThree();
  const [orientation, setOrientation] = useState<{ alpha: number; beta: number; gamma: number }>({
    alpha: 0,
    beta: 0,
    gamma: 0,
  });

  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      setOrientation({
        alpha: event.alpha ?? 0,
        beta: event.beta ?? 0,
        gamma: event.gamma ?? 0,
      });
    };
    window.addEventListener("deviceorientation", handleOrientation, true);
    return () => window.removeEventListener("deviceorientation", handleOrientation);
  }, []);

  useFrame(() => {
    const alpha = orientation.alpha;
    let beta = orientation.beta;
    const gamma = orientation.gamma;
    
    beta = Math.max(90, beta);

    // オイラー角 → 向きベクトル
    const a = THREE.MathUtils.degToRad(alpha);
    const b = THREE.MathUtils.degToRad(beta - 90);
    const g = THREE.MathUtils.degToRad(gamma);

    const euler = new THREE.Euler(b, a, -g, "YZX");
    const direction = new THREE.Vector3(0, 0, -1).applyEuler(euler);

    // カメラ更新
    camera.up.copy(new THREE.Vector3(0, 1, 0));
    camera.position.set(0, 0, 0);
    camera.lookAt(direction);
  });

  return null;
};

export default CameraMoveControls;