import { useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import SettingSlider from "./SettingSlider";
import StarCheckWindow from "./StarCheckWindow";

interface ViewSettingProps {
  preContrastValue: number;
  preStarSizeValue: number;
  setPreContrastValue: (value: number) => void;
  setPreStarSizeValue: (value: number) => void;
}

const ViewSetting = ({ preContrastValue, preStarSizeValue, setPreContrastValue, setPreStarSizeValue }: ViewSettingProps) => {
  return (
    <>
      <div className="flex gap-5 w-full mt-5 flex-col lg:flex-row">
        <div className={`flex justify-center items-center lg:max-w-[600px] lg:flex-1 h-[100px] bg-background border-1 border-foreground rounded-lg`}>
          <Canvas camera={{ position: [0, 0, 0], fov: 75 }}>
            <StarCheckWindow
              preContrastValue={preContrastValue}
              preStarSizeValue={preStarSizeValue}
            />
          </Canvas>
        </div>
        <SettingSlider
          sliders={[
            {
              name: "コントラスト",
              min: 0,
              max: 1,
              step: 0.1,
              defaultValue: preContrastValue,
              valueHandle: setPreContrastValue,
            },
            {
              name: "星サイズ",
              min: 1,
              max: 5,
              step: 0.5,
              defaultValue: preStarSizeValue,
              valueHandle: setPreStarSizeValue,
            },
          ]}
        />
      </div>
    </>
  );
};

export default ViewSetting;
