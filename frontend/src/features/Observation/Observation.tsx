"use client";

import FunctionButtons from "./components/FunctionButtons";
import SkyView from "./components/SkyView";

import backArrowIcon from "./assets/back_arrow.svg";
import settingIcon from "./assets/settings.svg";
import searchIcon from "./assets/search.svg";
// import constellationIcon from "./assets/constellation.svg";
import StarInformationDialog from "./components/StarInformationDialog";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { useStarData } from "@/context/StarDataContext";
import { getStarDetailInfo } from "@/lib/api/stars";
import { StarData } from "@/type/StarData";
import { StarDetailInfo } from "@/type/StarDetailInfo";
import IconButton from "./components/IconButton";
import { useTransitionNavigation } from "@/utils/trantision";

type ObservationProps = {
  setPhase: (phase: "idle" | "transitioning") => void;
};

const Observation = ({ setPhase }: ObservationProps) => {
  const transition = useTransitionNavigation();
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);
  const [isVisibleConstellationLines, setIsVisibleConstellationLines] = useState<boolean>(false);
  const [closestStar, setClosestStar] = useState<StarData | null>(null);
  const [closestStarDetailInfo, setClosestStarDetailInfo] = useState<StarDetailInfo | null>(null);
  const currentDirectionRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const { starData, vMagRanges } = useStarData();
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [openPermissionDialog, setOpenPermissionDialog] = useState(true);

  const handleGrantedClick = () => {
    const requestPermission = (DeviceOrientationEvent as DeviceOrientationEventConstructor)?.requestPermission;
    if (typeof requestPermission === "function") {
      requestPermission()
        .then((response: "granted" | "denied") => {
          if (response === 'granted') {
            window.addEventListener('deviceorientation', () => {});
            setPermissionGranted(true);
            setOpenPermissionDialog(false);
            return;
          }
        })
        .catch(console.error);
    }
    setOpenPermissionDialog(false);
  }

  const handleDeniedClick = () => {
    setOpenPermissionDialog(false);
    setPermissionGranted(false);
  }

  const handleDirectionChange = (direction: THREE.Vector3) => {
    currentDirectionRef.current = direction.clone();
  };

  useEffect(() => {
    const requestPermission = (DeviceOrientationEvent as DeviceOrientationEventConstructor)?.requestPermission;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    
    if (typeof requestPermission !== "function" || !isIOS) {
      setPermissionGranted(true);
      const handleOrientation = (event: DeviceOrientationEvent) => {
        const { alpha, beta, gamma } = event;
        if (
          alpha === null ||
          beta === null ||
          gamma === null ||
          isNaN(alpha) ||
          isNaN(beta) ||
          isNaN(gamma)
        ) {
          setPermissionGranted(false);
        }
        window.removeEventListener("deviceorientation", handleOrientation);
      };
      window.addEventListener("deviceorientation", handleOrientation, { once: true });
      
      setOpenPermissionDialog(false);
    }
    
    setShowPopup(true);
    const timer = setTimeout(() => setShowPopup(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleSearchButtonClick = () => {
    const cameraDirection = currentDirectionRef.current;
    
    let closestStar: StarData = starData[0];
    let minAngle = Infinity;

    starData.filter(
      star => star.vMag >= vMagRanges.min && star.vMag <= vMagRanges.max
    ).forEach((star) => {
      // 星の赤経・赤緯から3D座標に変換
      const dec = (star.declination * Math.PI) / 180;
      const ra = (star.rightAscension * Math.PI) / 180;
      const radius = 10; // 球面半径（任意）

      const starPosition = new THREE.Vector3(
        radius * Math.cos(dec) * Math.cos(ra),
        radius * Math.sin(dec),
        radius * Math.cos(dec) * Math.sin(ra)
      );

      // カメラ方向と星の位置の角度を計算
      const angle = cameraDirection.angleTo(starPosition);

      // 最小角度の星を記録
      if (angle < minAngle) {
        minAngle = angle;
        closestStar = star;
      }
    });

    if (closestStar !== null) {
      try {
        setClosestStar(closestStar);
        handleStarDetail(closestStar.starId);
      } catch (error) {
        console.error("Error fetching star details:", error);
        return;
      }

      setIsOpenDialog(true);
    }
  };

  const handleStarDetail = async (starId: string) => {
    const data = await getStarDetailInfo(starId)

    if (!data.success) {
      console.error(data.error);
      return;
    }

    // 取得した星の詳細情報を状態に保存
    setClosestStarDetailInfo(data.starDetailInfoData);
  };

  const handleBackButtonClick = () => {
    if (!document.startViewTransition) {
      transition("/location-settings", "bottom_to_top_ease_out");
      return;
    }

    document.documentElement.dataset.transition = "bottom_to_top_ease_in";

    document.startViewTransition(async() => {
      await Promise.resolve(setPhase("transitioning"));
    });
    
    setTimeout(() => {
      transition("/location-settings", "bottom_to_top_ease_out");
    }, 750);
  };

  const handleSettingButtonClick = () => {
    transition("/settings", "top_to_bottom");
  };

  return (
    <>
      <div className="flex w-full h-full relative overflow-hidden">
        <SkyView
          setTargetVector={handleDirectionChange}
          isVisibleConstellationLines={isVisibleConstellationLines}
          permissionGranted={permissionGranted}
          className={`w-full h-full z-0`}
        />
        <FunctionButtons
          icons={[
            {
              icon: { path: backArrowIcon.src, alt: "戻るボタン" },
              clickHandle: () => {handleBackButtonClick();},
            },
            {
              icon: { path: settingIcon.src, alt: "設定ボタン" },
              clickHandle: () => {handleSettingButtonClick();},
            },
            // {
            //   icon: { path: settingIcon.src, alt: "設定ボタン" },
            //   clickHandle: () => {},
            // },
            // {
            //   icon: { path: constellationIcon.src, alt: "星座表示ボタン" },
            //   clickHandle: () => {setIsVisibleConstellationLines(!isVisibleConstellationLines);},
            // },
          ]}
        />
        <div className="flex h-full items-end absolute w-15 py-5 mr-5 right-0 bottom-0">
          <IconButton
            icon={{ path: searchIcon.src, alt: "検索" }}
            isActive={true}
            clickHandle={() => {handleSearchButtonClick();}}
            className="absolute"
          />
        </div>
        {showPopup && (
          <div className="bg-background/40 fixed inset-0 flex items-center justify-center z-40 pointer-events-none">
            <div className="bg-white/95 text-black px-6 py-4 rounded-lg shadow-lg max-w-xs text-center pointer-events-auto">
              <div className="text-2xl">スマホを上に向けて星を観察します。</div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">周囲に物がないか注意してください。</div>
            </div>
          </div>
        )}
        
        {(!showPopup && openPermissionDialog) && 
          <div className="bg-background/40 fixed inset-0 flex items-center justify-center z-30 pointer-events-none">
            <div className="bg-white/95 text-black px-6 py-6 rounded-lg shadow-lg max-w-xs text-center pointer-events-auto">
              <div className="text-2xl">スマホの傾き取得を</div>
              <div className="flex justify-center gap-5 mt-4">
                <button className="h-10 w-30 border border-base-color rounded-md hover:bg-background/10" onClick={handleDeniedClick}>
                  許可しない
                </button>
                <button className="h-10 w-30 border border-base-color rounded-md hover:bg-background/10" onClick={handleGrantedClick}>
                  許可する
                </button>
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                気持ちの良いhosimi利用のため、<br />「許可する」の選択を推奨します。
              </div>
            </div>
          </div>
        }
        {(closestStar && closestStarDetailInfo) && (
          <StarInformationDialog
            starDetailInfo={closestStarDetailInfo}
            starData={closestStar}
            isOpenDialog={isOpenDialog}
            setIsOpenDialog={setIsOpenDialog}
            className={`absolute z-30 w-full h-full`}
          />
        )}
      </div>
    </>
  );
};

export default Observation;
