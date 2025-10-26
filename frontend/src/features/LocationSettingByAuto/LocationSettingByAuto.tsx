"use client";

import { GeoLocation } from "@/type/GeoLocation";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUserPosition } from "@/context/UserPositionContext";
import CheckMap from "./components/CheckMap";
import DecorateBorder from "@/components/DecorateBorder";
import { useTransitionNavigation } from "@/utils/trantision";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

const LocationSettingByAuto = () => {
  const router = useRouter();
  const transition = useTransitionNavigation();
  const { setPosition } = useUserPosition();
  const [userPosition, setUserPosition] = useState<GeoLocation>({ latitude: 35.68132693484021, longitude: 139.76719496924264 });
  const [activeConfirmButton, setActiveConfirmButton] = useState(false);

  const handleGPSChenge = (userPosition: GeoLocation) => {
    if (!userPosition) {
      setActiveConfirmButton(false);
      return;
    }
    setUserPosition(userPosition);
    setActiveConfirmButton(true);
  };

  const clickMoveManualButton = () => {
    router.push("/location-settings/manual");
  }
  const clickConfirmPositionButton = () => {
    if (!activeConfirmButton) return;
    setPosition(userPosition);
    transition("/observation", "top_to_bottom");
  }

  return (
    <>
      <div className="mb-10 lg:mb-30 w-full max-w-[800px] flex flex-col gap-8 lg:gap-4 items-center">
        <CheckMap
          handleGPSChenge={handleGPSChenge}
          className="flex-1 w-full mb-5 lg:mb-10 min-h-[300px] max-h-1/2"
        />
        <div className="w-full flex flex-col lg:flex-row justify-center items-center gap-3">
          <DecorateBorder isBorderPutX={true} className="w-full h-11 lg:h-20 bg-foreground/30">
            <button onClick={clickMoveManualButton} className="w-full h-full hover:bg-background/20">
              <span className="text-sm lg:text-2xl">手動設定に切り替える</span>
            </button>
          </DecorateBorder>
          <DecorateBorder isBorderPutX={true} className="w-full h-11 lg:h-20 bg-foreground/30">
            <button onClick={clickConfirmPositionButton} className="w-full h-full hover:bg-background/20">
              <span className="text-sm lg:text-2xl align-middle">確認</span>
            </button>
          </DecorateBorder>
        </div>
      </div>
    </>
  );
};

export default LocationSettingByAuto;
