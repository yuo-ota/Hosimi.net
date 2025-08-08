"use client";

import LocationSettingButton from "@/components/LocationSettingButton";
import GPSIcon from "@/assets/location.svg";
import ManualIcon from "@/assets/touch.svg";

const LocationSetting = () => {
  return (
    <>
      <div className="my-30 w-full h-[500px] flex justify-center gap-10">
        <LocationSettingButton
          icon={{ path: GPSIcon.src, alt: "GPSアイコン" }}
          buttonTitle="GPS情報で設定する"
          buttonDescription={
            <span className="text-lg text-left">
              GPS情報をもとに自動的に設定します。
              <br />
              GPSを許可する必要があります。
            </span>
          }
          handleClick={() => console.log("clicked!")}
          className="w-9/20 h-full"
        />
        <LocationSettingButton
          icon={{ path: ManualIcon.src, alt: "手動アイコン" }}
          buttonTitle="手動で設定する"
          buttonDescription={
            <span className="text-lg text-left">
              地名を自身で入力して設定します。
              <br />
              希望に沿わない可能性もあります。
            </span>
          }
          handleClick={() => console.log("clicked!")}
          className="w-9/20 h-full"
        />
      </div>
    </>
  );
};

export default LocationSetting;
