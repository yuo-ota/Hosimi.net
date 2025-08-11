"use client";

import FunctionButtons from "./components/FunctionButtons";
import SkyView from "./components/SkyView";

import settingIcon from "./assets/settings.svg";
import StarInformationSheet from "./components/StarInformationSheet";
import { useState } from "react";

const Observation = () => {
  const [isOpenSheet, setIsOpenSheet] = useState<boolean>(true);
  const SHEET_WIDTH = 500;
  const SHEET_HEIGHT = 500;

  return (
    <>
      <div className="flex w-full h-full relative overflow-hidden">
        <SkyView
          className={`absolute -left-[${
            SHEET_WIDTH / 2
          }px] w-[calc(100%+${SHEET_WIDTH}px)] h-full z-0`}
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
        <StarInformationSheet
          sheetWidth={SHEET_WIDTH}
          sheetHeight={SHEET_HEIGHT}
          starData={{
            name: "NAME LMC",
            category: "銀河",
            vMag: 0.4,
            rightAscension: "5時23分34.6秒",
            declination: "-69度45分22秒",
          }}
          isOpenSheet={isOpenSheet}
          setIsOpenSheet={setIsOpenSheet}
          className={`absolute z-30`}
        />
      </div>
    </>
  );
};

export default Observation;
