"use client";

import { useEffect, useRef, useState } from "react";
import { StarDetailInfo } from "@/type/StarDetailInfo";
import { StarData } from "@/type/StarData";
import DecorateBorder from "@/components/DecorateBorder";

type StarInformationDialogProps = {
  starDetailInfo: StarDetailInfo;
  starData: StarData;
  isOpenDialog: boolean;
  setIsOpenDialog: (isOpenDialog: boolean) => void;
  className?: string;
};

const StarInformationDialog = ({
  starDetailInfo,
  starData,
  isOpenDialog,
  setIsOpenDialog,
  className = "",
}: StarInformationDialogProps) => {
  const [isAladinLoaded, setIsAladinLoaded] = useState(false);
  const aladinRef = useRef<HTMLDivElement>(null);

  const handleCloseDialog = () => {
    setIsOpenDialog(false);
  }

  useEffect(() => {
    if (!isOpenDialog) {
      setIsAladinLoaded(false);
    };

    const loadAladin = async () => {
      const existingScript = document.querySelector('script[src*="aladin.js"]');

      if (!existingScript) {
        const script = document.createElement("script");
        script.src = "https://aladin.cds.unistra.fr/AladinLite/api/v3/latest/aladin.js";
        script.type = "text/javascript";
        script.async = true;

        const scriptPromise = new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
        });

        document.head.appendChild(script);
        await scriptPromise;
      }

      // 少し待ってからAladin初期化
      setTimeout(() => {
        console.log(window);
        if (window.A && aladinRef.current) {
          try {
            (window.A.aladin(aladinRef.current, {
              fov: 1,
              target: starDetailInfo.starName,
              showReticle: false,
              showProjectionControl: false,
              showZoomControl: false,
              showFullscreenControl: false,
              showLayersControl: false,
              showGotoControl: false,
              showFrame: false,
            }));
            setIsAladinLoaded(true);
          } catch (err) {
            console.error("Aladin Lite initialization failed:", err);
          }
        }
      }, 1000);
    };

    loadAladin();
  }, [isOpenDialog]);

  return isOpenDialog && (
    <>
      <div className={`${className} flex justify-center items-center bg-background/40`}>
        <DecorateBorder
          className={`w-8/10 max-w-[500px] lg:flex-1 flex flex-col bg-foreground/50 p-10 gap-y-10 justify-center items-start`}
          isBorderPutX={false}
        >
          <div
            ref={aladinRef}
            className="w-full aspect-[1.3333] rounded-md flex-none relative pointer-events-none"
          >
            {!isAladinLoaded && (
              <div className="absolute inset-0 animate-pulse bg-base/30 rounded-md flex items-center justify-center">
                <span className="text-foreground">読み込み中...</span>
              </div>
            )}
          </div>

          <div className="flex flex-col flex-none">
            <span className="font-title font-bold [word-spacing:-0.3em] text-4xl text-foreground">
              {starDetailInfo.starName}
            </span>
            <span className="font-title font-bold text-2xl text-foreground">
              {starDetailInfo.category}
            </span>
            <div className="flex flex-col mt-8 gap-y-2">
              <div className="flex gap-x-2 items-end">
                <span className="text-md text-foreground">等級:</span>
                <span className="font-num text-xl text-foreground">
                  {starData.vMag}
                </span>
              </div>
              <div className="flex gap-x-2 items-end">
                <span className="text-md text-foreground">赤経:</span>
                <span className="font-num text-xl text-foreground">
                  {starData.rightAscension}°
                </span>
              </div>
              <div className="flex gap-x-2 items-end">
                <span className="text-md text-foreground">赤緯:</span>
                <span className="font-num text-xl text-foreground">
                  {starData.declination}°
                </span>
              </div>
            </div>
          </div>
          <button
            className="w-full h-11 lg:h-12 bg-foreground rounded-full flex justify-center items-center px-4 lg:px-6"
            onClick={handleCloseDialog}>
            <span className="text-background text-lg lg:text-xl">閉じる</span>
          </button>
        </DecorateBorder>
      </div>
      <style jsx global>{`
        .aladin-horizontal-list {
          display: none !important;
        }
      `}</style>
    </>
  );
};

export default StarInformationDialog;
