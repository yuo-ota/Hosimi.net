"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

type CheckMapProps = {
  handleGPSChenge: (userPosition: GeoLocation) => void;
  className?: string;
};

const CheckMap = ({ handleGPSChenge, className }: CheckMapProps) => {
  const [location, setLocation] = useState<GeoLocation>({
    latitude: null,
    longitude: null,
  });

  const [secondsLeft, setSecondsLeft] = useState(10);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const [countFlag, setCountFlag] = useState(true);
  const gpsRef = useRef<NodeJS.Timeout | null>(null);

  const fetchLocation = () => {
    setCountFlag(false);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          setLocation({
            latitude,
            longitude,
          });
          handleGPSChenge({
            latitude: latitude,
            longitude: longitude,
          });
        },
        (error: GeolocationPositionError) => {
          setLocation({
            latitude: null,
            longitude: null,
          });
          handleGPSChenge({
            latitude: null,
            longitude: null,
          });
        }
      );
    }
    setCountFlag(true);
  };

  useEffect(() => {
    // 初回取得
    fetchLocation();

    if (countFlag) {
      // GPSの10秒ごとの再取得
      const loopFetch = () => {
        fetchLocation();
        gpsRef.current = setTimeout(loopFetch, 10000);
      };
      gpsRef.current = setTimeout(loopFetch, 10000);

      // 1秒カウントダウン更新
      countdownRef.current = setInterval(() => {
        setSecondsLeft((prev) => (prev === 1 ? 10 : prev - 1));
      }, 1000);
    }

    // クリーンアップ
    return () => {
      if (gpsRef.current) clearTimeout(gpsRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  return (
    <>
      <div className={`${className} flex flex-col items-start`}>
        <div className="w-full flex items-end">
          <div className="w-full flex justify-end">
            位置更新まであと{secondsLeft}秒
          </div>
        </div>
        {location.latitude === null || location.longitude === null ? (
          <div className="flex w-full flex-1 border-3 bg-attention/20 border-attention rounded-lg p-10">
            GPS情報が取得できません。
            <br />
            ブラウザの設定を確認するか、手動設定に切り替えてください
          </div>
        ) : (
          <Map userPosition={location} />
        )}
      </div>
    </>
  );
};

export default CheckMap;
