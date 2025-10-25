"use client";

import DecorateBorder from "@/components/DecorateBorder";
import ArrowIcon from "@/assets/arrow.svg";
import { useRouter } from "next/navigation";
import { useTransitionNavigation } from "@/utils/trantision";

const LocationSetting = () => {
  const transition = useTransitionNavigation();

  const clickGPSSettingButton = () => {
    transition("/location-settings/auto", "top_to_bottom");
  };

  const clickManualSettingButton = () => {
    transition("/location-settings/manual", "top_to_bottom");
  };

  return (
    <>
      <div className="my-10 lg:my-30 w-full h-[500px] flex justify-center gap-5 lg:gap-10 flex-col lg:flex-row items-center">
        <DecorateBorder
          isBorderPutX={true}
          className="w-9/10 lg:w-7/20 p-4 lg:p-8 bg-foreground/30"
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
        </DecorateBorder>
        <DecorateBorder
          isBorderPutX={true}
          className="w-9/10 lg:w-7/20 p-4 lg:p-8 bg-foreground/30"
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
        </DecorateBorder>
      </div>
    </>
  );
};

export default LocationSetting;
