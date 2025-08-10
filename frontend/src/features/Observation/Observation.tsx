"use client";

import FunctionButtons from "./components/FunctionButtons";
import SkyView from "./components/SkyView";

import settingIcon from "./assets/settings.svg";

const Observation = () => {
  const SheetWidth = 500;

  return (
    <>
      <div className="flex w-full h-full relative overflow-hidden">
        <SkyView
          className={`absolute -left-[${
            SheetWidth / 2
          }px] w-[calc(100%+${SheetWidth}px)] h-full z-0`}
        />
        <FunctionButtons
          icons={[
            {
              icon: { path: settingIcon.src, alt: "設定ボタン" },
              clickHandle: () => {},
            },
            {
              icon: { path: settingIcon.src, alt: "設定ボタン" },
              clickHandle: () => {},
            },
            {
              icon: { path: settingIcon.src, alt: "設定ボタン" },
              clickHandle: () => {},
            },
          ]}
          sliderValueChangeHandle={[(n) => {}, (n) => {}]}
        />
        <div
          className={`absolute -right-[0px] h-full w-[${SheetWidth}px] bg-red-200 rounded-lg z-100`}
        ></div>
      </div>
    </>
  );
};

export default Observation;
