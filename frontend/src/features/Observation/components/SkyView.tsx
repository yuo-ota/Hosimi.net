import Reticle from "../assets/reticle.svg";

import { Canvas } from "@react-three/fiber";
import StarField from "./StarField";
import { OrbitControls, DeviceOrientationControls } from "@react-three/drei";
import * as THREE from "three";
import CameraDirectionTracker from "./CameraDirectionTracker";
import Image from "next/image";
import { useEffect } from "react";
import { ConstellationDisplayMode } from "@/type/ConstellationDisplayMode";

type SkyViewProps = {
  setTargetVector: (vector: THREE.Vector3) => void;
  constellationDisplayMode: ConstellationDisplayMode;
  permissionGranted: boolean;
  className?: string;
};

const SkyView = ({setTargetVector, constellationDisplayMode, permissionGranted, className = "" }: SkyViewProps) => {
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
          <Canvas
            camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 0, 0] }}
            // 星・星座線の clippingPlanes (地平線より下を切り捨てる) を効かせるために必要
            gl={{ localClippingEnabled: true }}
          >
            {/* カメラ操作 */}
            {permissionGranted ?
              <DeviceOrientationControls key="device" />
            :
              <OrbitControls
                // target をカメラ位置(0,0,0)からわずかにでもずらさないと
                // three.js が回転の基準となる向きを計算できないための最小値。
                // 大きくすると、回転時にカメラ自体が原点から離れてしまい、
                // 星(等級で距離が変わる)と星座線(固定距離)とで見た目のずれ量が
                // 変わってしまう(視差)。
                target={[0.0001, 0, 0]}
                enablePan={false}
                enableZoom={false}
                enableRotate={true}
                key="orbit"
              />
            }

            {/* カメラの方向を追跡 */}
            <CameraDirectionTracker onDirectionChange={setTargetVector} />

            {/* ライト */}
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} />

            {/* 星 */}
            <StarField constellationDisplayMode={constellationDisplayMode} />
          </Canvas>
        </div>
      </div>
    </>
  );
};

export default SkyView;
