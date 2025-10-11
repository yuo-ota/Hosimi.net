"use client";

import FunctionButtons from "./components/FunctionButtons";
import SkyView from "./components/SkyView";

import settingIcon from "./assets/settings.svg";
import searchIcon from "./assets/search.svg";
import constellationIcon from "./assets/constellation.svg";
import StarInformationSheet from "./components/StarInformationSheet";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useStarData } from "@/context/StarDataContext";
import { getStarDetailInfo } from "@/lib/api/stars";
import { StarData } from "@/type/StarData";
import { StarDetailInfo } from "@/type/StarDetailInfo";
import IconButton from "./components/IconButton";
import { getEquatorialCoords } from "@/lib/api/equatorial";
import { useUserPosition } from "@/context/UserPositionContext";
import { EquatorialCoords } from "@/type/EquatorialCoords";

const Observation = () => {
  const [isOpenSheet, setIsOpenSheet] = useState<boolean>(false);
  const [isVisibleConstellationLines, setIsVisibleConstellationLines] = useState<boolean>(false);
  const [closestStar, setClosestStar] = useState<StarData | null>(null);
  const [userEquatorialCoord, setUserEquatorialCoord] = useState<EquatorialCoords | null>(null);
  const [closestStarDetailInfo, setClosestStarDetailInfo] = useState<StarDetailInfo | null>(null);
  const currentDirectionRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const { starData, vMagRanges } = useStarData();
  const { position } = useUserPosition();
  const SHEET_WIDTH = 500;
  const SHEET_HEIGHT = 500;

  useEffect(() => {
    (async () => {
      const [latitude, longitude] = [position?.latitude, position?.longitude];
      if (latitude == null || longitude == null) {
        console.warn("User position is not available.");
        return;
      }

      const userEquatorialCoordResult = await getEquatorialCoords(latitude, longitude);
      console.log("Equatorial Coordinates Result:", userEquatorialCoordResult);
      if (!userEquatorialCoordResult.success) {
        console.error("Failed to get equatorial coordinates:", userEquatorialCoordResult.error);
        return;
      }

      setUserEquatorialCoord(userEquatorialCoordResult.equatorialCoordsData);
    })();
  }, [position]);

  const handleDirectionChange = (direction: THREE.Vector3) => {
    currentDirectionRef.current = direction.clone();
  };

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

      setIsOpenSheet(true);
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

  const handleSettingButtonClick = () => {
    window.location.href = "/settings";
  };

  return (
    <>
      <div className="flex w-full h-full relative overflow-hidden">
        <SkyView
          sheetWidth={SHEET_WIDTH}
          setTargetVector={handleDirectionChange}
          isVisibleConstellationLines={isVisibleConstellationLines}
          userEquatorialCoord={userEquatorialCoord}
          className={`absolute -left-[${
            SHEET_WIDTH / 2
          }px] h-full z-0`}
        />
        <FunctionButtons
          icons={[
            {
              icon: { path: settingIcon.src, alt: "設定ボタン" },
              clickHandle: () => {handleSettingButtonClick();},
            },
            // {
            //   icon: { path: settingIcon.src, alt: "設定ボタン" },
            //   clickHandle: () => {},
            // },
            {
              icon: { path: constellationIcon.src, alt: "星座表示ボタン" },
              clickHandle: () => {setIsVisibleConstellationLines(!isVisibleConstellationLines);},
            },
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
        {(closestStar && closestStarDetailInfo) && (
          <StarInformationSheet
            sheetWidth={SHEET_WIDTH}
            sheetHeight={SHEET_HEIGHT}
            starDetailInfo={closestStarDetailInfo}
            starData={closestStar}
            isOpenSheet={isOpenSheet}
            setIsOpenSheet={setIsOpenSheet}
            className={`absolute z-30`}
          />
        )}
      </div>
    </>
  );
};

export default Observation;
