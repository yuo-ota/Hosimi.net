"use client";

import FunctionButtons from "./components/FunctionButtons";
import SkyView from "./components/SkyView";

import settingIcon from "./assets/settings.svg";
import StarInformationSheet from "./components/StarInformationSheet";
import { useState } from "react";

const Observation = () => {
  const [isOpenSheet, setIsOpenSheet] = useState<boolean>(false);
  const SHEET_WIDTH = 500;
  const SHEET_HEIGHT = 500;

  return (
    <>
      <div className="flex w-full h-full relative overflow-hidden">
        <SkyView
          sheetWidth={SHEET_WIDTH}
          className={`absolute -left-[${
            SHEET_WIDTH / 2
          }px] h-full z-0`}
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
        />
        <StarInformationSheet
          sheetWidth={SHEET_WIDTH}
          sheetHeight={SHEET_HEIGHT}
          starDetailInfo={{
            starName: "NAME LMC",
            category: "銀河",
            distance: "5"
          }}
          starData={{
            starId: "1",
            declination: 35,
            rightAscension: 135,
            vMag: 0.4,
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
