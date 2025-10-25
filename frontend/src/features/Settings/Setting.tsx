"use client";

import SettingElement from "./components/SettingElement";
import ViewSetting from "./components/ViewSetting";
import { useState } from "react";
import { useSetting } from "@/context/SettingContext";
import DecorateBorder from "@/components/DecorateBorder";

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
        <div className="w-full flex justify-center items-center mt-16 lg:mt-32">
          <div className="w-full max-w-[800px] flex flex-col lg:flex-row justify-center items-center gap-3">
            <DecorateBorder isBorderPutX={true} className="w-full h-11 lg:h-20 bg-foreground/30">
              <button onClick={handleConfirmButton} className="w-full h-full hover:bg-background/20">
                <span className="text-sm lg:text-2xl">保存する</span>
              </button>
            </DecorateBorder>
            <DecorateBorder isBorderPutX={true} className="w-full h-11 lg:h-20 bg-foreground/30">
              <button onClick={handlePrevPageButtonClick} className="w-full h-full hover:bg-background/20">
                <span className="text-sm lg:text-2xl align-middle">戻る</span>
              </button>
            </DecorateBorder>
          </div>
        </div>
      </div>
    </>
  );
};

export default Setting;
