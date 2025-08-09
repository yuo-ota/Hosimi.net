"use client";

import DualButton from "@/components/DualButton";
import LocationInput from "./components/LocationInput";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

const LocationSettingByManual = () => {
  return (
    <>
      <div className="mb-10 lg:mb-30 w-full h-2/3 lg:h-[500px] flex flex-col lg:grid lg:grid-flow-row lg:grid-rows-[auto_1fr] lg:grid-cols-2 gap-8">
        <LocationInput className="w-full lg:w-auto lg:row-span-1"></LocationInput>
        <Map
          userPosition={{ latitude: 35, longitude: 135 }}
          className="flex-1 lg:col-span-1 w-full lg:w-auto lg:row-span-2"
        />
        <DualButton
          key={"aa"}
          buttons={[
            {
              isPriority: true,
              children: (
                <>
                  <span className="text-xs lg:text-lg">設定選択画面へ</span>
                  <span className="text-base lg:text-2xl">戻る</span>
                </>
              ),
              handleClick: () => console.log("戻るボタン"),
              isActive: true,
              className: "flex-1 w-full lg:px-4 py-2",
            },
            {
              isPriority: false,
              children: "確認",
              handleClick: () => console.log("確認ボタン"),
              isActive: true,
              className: "flex-1 w-full lg:px-4 py-2 text-base lg:text-2xl",
            },
          ]}
          className="h-[50px] lg:h-[70px] lg:row-span-1 w-full lg:w-auto flex justify-between  gap-x-5 gap-y-3 flex-col lg:flex-row"
        />
      </div>
    </>
  );
};

export default LocationSettingByManual;
