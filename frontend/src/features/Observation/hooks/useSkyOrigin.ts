import { useEffect, useState } from "react";
import { useUserPosition } from "@/context/UserPositionContext";
import { getEquatorialCoords } from "@/lib/api/equatorial";
import { SkyOrigin, calcLocalSiderealTimeDeg } from "@/utils/celestialSphere";

/**
 * 観測地の天頂が向いている赤道座標を取得し、天球の向きの基準として返す。
 *
 * バックエンドは月の位置から恒星時を求めているが、外部APIに依存していて落ちうる。
 * 取得できなかった場合は端末の時計から恒星時を計算して代用し、星空が出ない状態を避ける。
 */
export const useSkyOrigin = (): SkyOrigin | null => {
  const { position } = useUserPosition();
  const [skyOrigin, setSkyOrigin] = useState<SkyOrigin | null>(null);

  useEffect(() => {
    if (!position) return;

    let cancelled = false;

    (async () => {
      const result = await getEquatorialCoords(position.latitude, position.longitude);
      if (cancelled) return;

      if (result.success) {
        // 天頂の赤経は地方恒星時、天頂の赤緯は観測地の緯度に等しい
        setSkyOrigin({
          siderealTimeDeg: result.equatorialCoordsData.rightAscension,
          latitudeDeg: result.equatorialCoordsData.declination,
          baseAtMs: Date.now(),
        });
        return;
      }

      console.error(`観測地の赤道座標を取得できませんでした: ${result.error}`);
      setSkyOrigin({
        siderealTimeDeg: calcLocalSiderealTimeDeg(new Date(), position.longitude),
        latitudeDeg: position.latitude,
        baseAtMs: Date.now(),
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [position]);

  return skyOrigin;
};
