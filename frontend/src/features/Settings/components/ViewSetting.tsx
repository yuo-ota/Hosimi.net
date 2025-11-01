import { Canvas } from "@react-three/fiber";
import SettingSlider from "./SettingSlider";
import StarCheckWindow from "./StarCheckWindow";
import DecorateBorder from "@/components/DecorateBorder";

interface ViewSettingProps {
  preContrastValue: number;
  preStarSizeValue: number;
  setPreContrastValue: (value: number) => void;
  setPreStarSizeValue: (value: number) => void;
}

const ViewSetting = ({ preContrastValue, preStarSizeValue, setPreContrastValue, setPreStarSizeValue }: ViewSettingProps) => {
  return (
    <>
      <DecorateBorder isBorderPutX={false} className="grid grid-cols-1 lg:grid-cols-2 w-full max-w-[1000px] bg-foreground/5 py-3 px-5 lg:p-10">
        <div className={`flex justify-center items-center w-full h-full`}>
          <Canvas camera={{ position: [0, 0, 0], fov: 75 }}>
            <StarCheckWindow
              preContrastValue={preContrastValue}
              preStarSizeValue={preStarSizeValue}
            />
          </Canvas>
        </div>
        <div className={`flex justify-center items-center w-full h-full`}>
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
      </DecorateBorder>
    </>
  );
};

export default ViewSetting;
