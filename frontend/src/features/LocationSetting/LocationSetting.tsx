"use client";

import LocationSettingElement from "@/components/LocationSettingElement";
import ArrowIcon from "@/assets/arrow.svg";
import ManualIcon from "@/assets/touch.svg";
import CheckGPSDialog from "./components/CheckGPSDialog";
import { useRouter } from "next/navigation";
import { useState } from "react";

const LocationSetting = () => {
  const router = useRouter();
  const [isOpenDialog, setIsOpenDialog] = useState(false)

  const clickGPSSettingButton = () => {
    router.push("/location-settings/auto");
  }
  const clickManualSettingButton = () => {
    router.push("/location-settings/manual");
  }

  return (
    <>
      <div className="my-10 lg:my-30 w-full h-[500px] flex justify-center gap-5 lg:gap-10 flex-col lg:flex-row items-center">
        <LocationSettingElement
          isBorderPutX={true}
          className="w-9/10 lg:w-7/20"
        >
          <div className="flex flex-col justify-center w-full h-full">
            <span className="font-body text-2xl lg:text-4xl text-left mb-2 lg:mb-3">GPSから設定</span>
            <span className="text-sm lg:text-xl text-left mb-4 lg:mb-8">GPS情報をもとに自動で設定します。<br />(非対応端末では利用できません。)</span>
            <button
              className="w-full h-8 lg:h-12 bg-foreground rounded-full flex justify-between items-center px-4 lg:px-6"
              onClick={clickGPSSettingButton}>
              <span className="text-background text-sm lg:text-xl">ここから</span>
              <img src={ArrowIcon.src} alt="矢印アイコン" className="h-2/5" />
            </button>
          </div>
        </LocationSettingElement>
        <LocationSettingElement
          isBorderPutX={true}
          className="w-9/10 lg:w-7/20"
        >
          <div className="flex flex-col justify-center w-full h-full">
            <span className="font-body text-2xl lg:text-4xl text-left mb-2 lg:mb-3">手動で設定</span>
            <span className="text-sm lg:text-xl text-left mb-4 lg:mb-8">
              地名を自身で入力して設定します。
              <br />
              希望に沿わない可能性もあります。
            </span>
            <button
              className="w-full h-8 lg:h-12 bg-foreground rounded-full flex justify-between items-center px-4 lg:px-6"
              onClick={clickManualSettingButton}>
              <span className="text-background text-sm lg:text-xl">ここから</span>
              <img src={ArrowIcon.src} alt="矢印アイコン" className="h-2/5" />
            </button>
          </div>
        </LocationSettingElement>
      </div>
    </>
  );
};

export default LocationSetting;
