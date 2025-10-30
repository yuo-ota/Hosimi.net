import Reticle from "../assets/reticle.svg";

import { Canvas } from "@react-three/fiber";
import StarField from "./StarField";
import { OrbitControls, DeviceOrientationControls } from "@react-three/drei";
import * as THREE from "three";
import CameraDirectionTracker from "./CameraDirectionTracker";
import Image from "next/image";
import { useEffect } from "react";

type SkyViewProps = {
  setTargetVector: (vector: THREE.Vector3) => void;
  isVisibleConstellationLines: boolean;
  permissionGranted: boolean;
  className?: string;
};

const SkyView = ({setTargetVector, isVisibleConstellationLines, permissionGranted, className = "" }: SkyViewProps) => {
  useEffect(() => {
    console.log("SkyView rendered with permissionGranted:", permissionGranted);
  }, [permissionGranted]);


  return (
    <>
      <div className={`${className}`} >
        <Image
          src={Reticle.src}
          alt="照準"
          width={24}
          height={24}
          className="absolute top-1/2 left-1/2 aspect-square w-[30px] transform -translate-x-1/2 -translate-y-1/2 z-20"
        />
        {/* Three.js 描画領域 */}
        <div className="absolute w-full h-full z-0">
          <Canvas>
            {/* カメラ操作 */}
            {permissionGranted ? <DeviceOrientationControls key="device" /> : <OrbitControls key="orbit" />}

            {/* カメラの方向を追跡 */}
            <CameraDirectionTracker onDirectionChange={setTargetVector} />

            {/* ライト */}
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} />

            {/* 星 */}
            <StarField isVisibleConstellationLines={isVisibleConstellationLines} />
          </Canvas>
        </div>
      </div>
    </>
  );
};

export default SkyView;
