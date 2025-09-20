import Reticle from "../assets/reticle.svg";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import StarField from "./StarField";

type SkyViewProps = {
  sheetWidth: number;
  className?: string;
};

const SkyView = ({ sheetWidth, className = "" }: SkyViewProps) => {
  return (
    <>
      <div
        className={`${className}`}
        style={{
          width: `calc(100% + ${sheetWidth}px)`,
          left: `${-sheetWidth / 2}px`
        }}
      >
        <img
          src={Reticle.src}
          alt="照準"
          className="absolute top-1/2 left-1/2 aspect-square w-[30px] transform -translate-x-1/2 -translate-y-1/2 z-20"
        />
        {/* Three.js 描画領域 */}
        <div className="absolute w-full h-full z-0">
          <Canvas>
            {/* カメラ操作 */}
            <OrbitControls />

            {/* ライト */}
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} />

            {/* 星 */}
            <StarField />
          </Canvas>
        </div>
      </div>
    </>
  );
};

export default SkyView;
