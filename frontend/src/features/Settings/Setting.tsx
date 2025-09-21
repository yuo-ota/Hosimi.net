"use client";

import LocationSettingButton from "@/components/LocationSettingButton";
import SettingElement from "./components/SettingElement";
import GPSIcon from "@/assets/location.svg";
import ManualIcon from "@/assets/touch.svg";
import DualButton from "@/components/DualButton";
import ViewSetting from "./components/ViewSetting";
import { use, useEffect, useState } from "react";
import { useSetting } from "@/context/SettingContext";

const Setting = () => {
  const { contrastValue, starSizeValue, setContrastValue, setStarSizeValue } = useSetting();
  const [preContrastValue, setPreContrastValue] = useState<number>(contrastValue);
  const [preStarSizeValue, setPreStarSizeValue] = useState<number>(starSizeValue);

  const handleConfirmButton = () => {
    if (preContrastValue < 0 || preStarSizeValue < 0) return;
    setContrastValue(preContrastValue);
    setStarSizeValue(preStarSizeValue);
  }

  const handlePrevPageButtonClick = () => {
    window.location.href = "/observation";
  };

  return (
    <>
      <div className="mb-10 lg:mb-30 w-full flex justify-start gap-5 lg:gap-10 flex-col items-start">
        {/* <SettingElement title="観測値設定" className="w-full">
          <div className="flex gap-5 w-full lg:h-[350px] mt-5 flex-col lg:flex-row">
            <LocationSettingButton
              icon={{ path: GPSIcon.src, alt: "GPSアイコン" }}
              buttonTitle="GPS情報で設定する"
              buttonDescription={
                <span className="text-sm lg:text-lg text-left">
                  GPS情報をもとに自動的に設定します。
                  <br />
                  GPSを許可する必要があります。
                </span>
              }
              handleClick={() => console.log("clicked!")}
              className="w-full lg:w-3/10 h-[200px] lg:h-full"
            />
            <LocationSettingButton
              icon={{ path: ManualIcon.src, alt: "手動アイコン" }}
              buttonTitle="手動で設定する"
              buttonDescription={
                <span className="text-sm lg:text-lg text-left">
                  地名を自身で入力して設定します。
                  <br />
                  希望に沿わない可能性もあります。
                </span>
              }
              handleClick={() => console.log("clicked!")}
              className="w-full lg:w-3/10 h-[200px] lg:h-full"
            />
          </div>
        </SettingElement> */}
        <SettingElement title="視認性設定" className="w-full">
          <ViewSetting
            preContrastValue={preContrastValue}
            preStarSizeValue={preStarSizeValue}
            setPreContrastValue={setPreContrastValue}
            setPreStarSizeValue={setPreStarSizeValue}
          />
        </SettingElement>
        <DualButton
          key={"aa"}
          buttons={[
            {
              isPriority: true,
              children: (
                <>
                  <span className="text-base lg:text-2xl">変更を適用する</span>
                </>
              ),
              handleClick: () => handleConfirmButton(),
              isActive: true,
              className: "flex-1 w-full lg:px-4 py-2",
            },
            {
              isPriority: false,
              children: "戻る",
              handleClick: () => handlePrevPageButtonClick(),
              isActive: true,
              className: "flex-1 w-full lg:px-4 py-2 text-base lg:text-2xl",
            },
          ]}
          className="h-[50px] lg:h-[70px] lg:row-span-1 w-full lg:w-[800px] flex justify-between  gap-x-5 gap-y-3 flex-col lg:flex-row mb-25"
        />
      </div>
    </>
  );
};

export default Setting;
