"use client";

import DualButton from "@/components/DualButton";
import Headline from "@/components/Headline";
import CloseIcon from "@/features/LocationSetting/assets/close.svg";
import CheckMap from "./CheckMap";
import { Geolocation } from "@/type/Geolocation";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserPosition } from "@/context/UserPositionContext";

type CheckGPSDialogProps = {
  isOpenDialog: boolean;
  setIsOpenDialog: (isOpenDialog: boolean) => void
};

const CheckGPSDialog = ({ isOpenDialog, setIsOpenDialog }: CheckGPSDialogProps) => {
  const router = useRouter();
  const { setPosition } = useUserPosition();
  const [userPosition, setUserPosition] = useState<Geolocation | null>(null)
  const [activeConfirmButton, setActiveConfirmButton] = useState(false);

  const handleGPSChenge = (userPosition: Geolocation) => {
    if (userPosition.latitude === null || userPosition.longitude === null) {
      setActiveConfirmButton(false);
      return;
    }
    setUserPosition(userPosition);
    setActiveConfirmButton(true);
  };

  const clickSwitchManualSettingButton = () => {
    router.push("/location-settings/manual");
  }

  const clickConfirmPositionButton = () => {
    if (userPosition === null) {
      return;
    }
    
    setPosition(userPosition);
    router.push("/observation");
  }

  const clickCloseDialogButton = () => {
    setIsOpenDialog(false);
  }

  return (
    <>
      {isOpenDialog && (
        <>
          <div className="fixed left-0 top-0 w-dvw h-dvh bg-background/50 backdrop-blur-lg z-10"></div>
          <div
            className="top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 h-[80dvh] p-5 flex flex-col items-start absolute z-20 bg-foreground/30 backdrop-blur-lg
    rounded-md border border-foreground/30 shadow-lg"
          >
            <div className="w-full flex justify-between items-start justify-items-end">
              <Headline
                preferSmall={true}
                title="観測地点確認"
                description="現在の地点はこちらで間違いありませんか？"
                className="mb-5 lg:mb-10"
              />
              <button className="aspect-square h-full max-h-[60px]" onClick={clickCloseDialogButton}>
                <img
                  src={`${CloseIcon.src}`}
                  alt="閉じるボタン"
                  className="w-full h-full"
                />
              </button>
            </div>
            <CheckMap
              handleGPSChenge={handleGPSChenge}
              className="flex-1 w-full mb-5 lg:mb-10"
            />
            <div className="flex mt-auto w-full">
              <DualButton
                key={activeConfirmButton.toString()}
                buttons={[
                  {
                    isPriority: true,
                    children: (
                      <>
                        <span className="text-base md:text-xl">
                          手動設定に切り替える
                        </span>
                      </>
                    ),
                    handleClick: clickSwitchManualSettingButton,
                    isActive: true,
                    className: "flex-1 w-full lg:px-4 py-2",
                  },
                  {
                    isPriority: false,
                    children: "確認",
                    handleClick: clickConfirmPositionButton,
                    isActive: activeConfirmButton,
                    className:
                      "flex-1 w-full lg:px-4 py-2 text-base md:text-xl",
                  },
                ]}
                className="flex w-full justify-between items-center gap-x-5 gap-y-3 flex-col lg:flex-row"
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CheckGPSDialog;
