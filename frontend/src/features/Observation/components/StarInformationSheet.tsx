"use client";

import { useEffect, useState } from "react";
import ArrowIcon from "../assets/arrow.svg";
import { StarDetailInfo } from "@/type/StarDetailInfo";
import { StarData } from "@/type/StarData";

type StarInformationSheetProps = {
  sheetWidth: number;
  sheetHeight: number;
  starDetailInfo: StarDetailInfo;
  starData: StarData;
  isOpenSheet: boolean;
  setIsOpenSheet: (isOpenSheet: boolean) => void;
  className?: string;
};

const StarInformationSheet = ({
  sheetWidth,
  sheetHeight,
  starDetailInfo,
  starData,
  isOpenSheet,
  setIsOpenSheet,
  className = "",
}: StarInformationSheetProps) => {
  const [isLg, setIsLg] = useState(false);
  const [isAladinLoaded, setIsAladinLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://aladin.cds.unistra.fr/AladinLite/api/v3/latest/aladin.min.js";
    script.async = true;
    script.onload = () => {
      if (typeof window !== "undefined" && (window as any).A) {
        (window as any).A.aladin("#aladin-lite-div", {
          fov: 1,
          target: "M81",
          showReticle: false,
          showProjectionControl: false,
          showZoomControl: false,
          showFullscreenControl: false,
          showLayersControl: false,
          showGotoControl: false,
          showFrame: false,
        });
        setIsAladinLoaded(true);
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const updateSize = () => {
      setIsLg(window.innerWidth >= 1024);
    };
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <>
      <div
        className={`${className} flex flex-col lg:min-h-dvh`}
        style={
          isLg
            ? {
                right: isOpenSheet ? 0 : sheetWidth * -1,
                width: sheetWidth,
                height: "100%",
              }
            : {
                bottom: isOpenSheet ? 0 : sheetHeight * -1,
                width: "100%",
                height: sheetHeight,
              }
        }
      >
        <button
          className="flex-none w-full h-[80px] border rounded-t-lg lg:rounded-tl-lg backdrop-blur-lg bg-foreground/30 shadow-lg border-foreground/30 px-10 flex items-center justify-center lg:justify-start"
          onClick={() => setIsOpenSheet(false)}
        >
          <img
            src={ArrowIcon.src}
            alt="戻るボタン"
            className="h-2/5 rotate-90 lg:rotate-0"
          />
        </button>

        <div
          className={`overflow-y-auto lg:flex-1 flex flex-col w-full p-10 gap-y-10 border lg:rounded-bl-lg backdrop-blur-lg bg-foreground/30 shadow-lg border-foreground/30`}
        >
          {isAladinLoaded ? (
            <div
              id="aladin-lite-div"
              className="w-full aspect-[1.3333] rounded-md flex-none pointer-events-none"
            />
          ) : (
            <div className="w-full aspect-[1.3333] rounded-md flex-none animate-pulse bg-base/30"></div>
          )}

          <div className="flex flex-col flex-none">
            <span className="font-title text-4xl text-foreground">
              {starDetailInfo.starName}
            </span>
            <span className="font-title text-2xl text-foreground">
              {starDetailInfo.category}
            </span>
            <div className="flex flex-col mt-8 gap-y-2">
              <div className="flex gap-x-2">
                <span className="text-md text-foreground">等級:</span>
                <span className="font-num text-xl text-foreground">
                  {starData.vMag}
                </span>
              </div>
              <div className="flex gap-x-2">
                <span className="text-md text-foreground">赤経:</span>
                <span className="font-num text-xl text-foreground">
                  {starData.rightAscension}
                </span>
              </div>
              <div className="flex gap-x-2">
                <span className="text-md text-foreground">赤緯:</span>
                <span className="font-num text-xl text-foreground">
                  {starData.declination}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        .aladin-horizontal-list {
          display: none !important;
        }
      `}</style>
    </>
  );
};

export default StarInformationSheet;
