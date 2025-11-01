"use client";

import LocationInput from "./components/LocationInput";
import { GeoLocation } from "@/type/GeoLocation";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useUserPosition } from "@/context/UserPositionContext";
import DecorateBorder from "@/components/DecorateBorder";
import { useTransitionNavigation } from "@/utils/trantision";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

const LocationSettingByManual = () => {
  const transition = useTransitionNavigation();
  const { setPosition } = useUserPosition();
  const [userPosition, setUserPosition] = useState<GeoLocation>({ latitude: 35.74854770684698, longitude: 139.80631888301534 });

  const clickBackLocationSettingButton = () => {
    transition("/location-settings", "bottom_to_top");
  }
  const clickConfirmPositionButton = () => {
    setPosition(userPosition);
    transition("/observation", "top_to_bottom");
  }

  return (
    <>
      <div className="mb-10 lg:mb-30 w-full h-2/3 lg:h-[500px] flex flex-col lg:grid lg:grid-flow-row lg:grid-rows-[auto_1fr] lg:grid-cols-2 gap-8">
        <LocationInput setUserPosition={setUserPosition} className="w-full lg:w-auto lg:row-span-1"></LocationInput>
        <Map
          userPosition={userPosition}
          className="flex-1 lg:col-span-1 w-full lg:w-auto lg:row-span-2 min-h-[250px]"
        />
        
        <div className="w-full flex flex-col lg:flex-row justify-center items-center lg:items-start gap-3">
          <DecorateBorder isBorderPutX={true} className="w-full h-15 lg:h-20 bg-foreground/30">
            <button onClick={clickBackLocationSettingButton} className="w-full h-full hover:bg-background/20">
              <span className="text-lg lg:text-2xl">地点設定方法選択画面へ戻る</span>
            </button>
          </DecorateBorder>
          <DecorateBorder isBorderPutX={true} className="w-full h-15 lg:h-20 bg-foreground/30">
            <button onClick={clickConfirmPositionButton} className="w-full h-full hover:bg-background/20">
              <span className="text-lg lg:text-2xl align-middle">確認</span>
            </button>
          </DecorateBorder>
        </div>
      </div>
    </>
  );
};

export default LocationSettingByManual;
