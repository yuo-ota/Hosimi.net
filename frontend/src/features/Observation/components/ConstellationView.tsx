import { useStarData } from "@/context/StarDataContext";
import { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";

const ConstellationView = () => {
  const { starData, constellationLines } = useStarData();
  const linesRef = useRef<THREE.Group>(null!);

	const calcXYZ = (ra: number, dec: number) => {
		const radius = 10;
		const radDec = (dec * Math.PI) / 180;
		const radRa = (ra * Math.PI) / 180;
		const x = radius * Math.cos(radDec) * Math.cos(radRa);
		const y = radius * Math.sin(radDec);
		const z = radius * Math.cos(radDec) * Math.sin(radRa);
		return new THREE.Vector3(x, y, z);
	};

  // 星座線のgeometryとmaterialを作成
  const { geometry, material } = useMemo(() => {
		console.log("aaa");
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

        if (startStar && endStar) {
					const dec = (startStar.declination * Math.PI) / 180;
					const ra = (startStar.rightAscension * Math.PI) / 180;
					const radius = 10;
					const x = radius * Math.cos(dec) * Math.cos(ra);
					const y = radius * Math.sin(dec);
					const z = radius * Math.cos(dec) * Math.sin(ra);
          // 各線につき2つの点を追加（開始点と終了点）
          points.push(
            calcXYZ(startStar.rightAscension, startStar.declination),
            calcXYZ(endStar.rightAscension, endStar.declination)
          );
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
  }, [starData, constellationLines]);

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