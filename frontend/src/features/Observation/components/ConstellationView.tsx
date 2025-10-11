import { useStarData } from "@/context/StarDataContext";
import { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { EquatorialCoords } from "@/type/EquatorialCoords";
import { calcViewCoords } from "@/utils/coordinateUtils";

interface ConstellationViewProps {
  userEquatorialCoord: EquatorialCoords | null;
}

const ConstellationView = ({ userEquatorialCoord }: ConstellationViewProps) => {
  const { starData, constellationLines } = useStarData();
  const linesRef = useRef<THREE.Group>(null!);

  // 星座線のgeometryとmaterialを作成
  const { geometry, material } = useMemo(() => {
    if (!starData.length || !constellationLines.length) {
      return { geometry: null, material: null };
    }

    // starDataをIDでマップ化して高速検索
    const starMap = new Map(starData.map(star => [star.starId.toString(), star]));

    const points: THREE.Vector3[] = [];

    constellationLines.forEach(constellation => {
      constellation.constellationLines.forEach(line => {
        const startStar = starMap.get(line.startStarId);
        const endStar = starMap.get(line.endStarId);

        if (startStar && endStar && userEquatorialCoord) {
          // ユーザーの位置を基準とした座標変換を適用
          const startPos = calcViewCoords(
            startStar.rightAscension,
            startStar.declination,
            userEquatorialCoord,
            10
          );
          const endPos = calcViewCoords(
            endStar.rightAscension,
            endStar.declination,
            userEquatorialCoord,
            10
          );

          // 各線につき2つの点を追加（開始点と終了点）
          points.push(startPos, endPos);
        }
      });
    });

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: 0xffffff,
      opacity: 0.6,
      transparent: true
    });

    return { geometry, material };
  }, [starData, constellationLines, userEquatorialCoord]);

  // Three.jsのlineオブジェクトを更新
  useEffect(() => {
    if (linesRef.current && geometry && material) {
      // 既存の線をクリア
      linesRef.current.clear();

      // 新しい線を追加（LineSegmentsを使用して各ペアを独立した線として描画）
      const lines = new THREE.LineSegments(geometry, material);
      linesRef.current.add(lines);
    }
  }, [geometry, material]);

  return (
    <group ref={linesRef} />
  );
};

export default ConstellationView;