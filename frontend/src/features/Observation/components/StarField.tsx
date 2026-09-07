import * as THREE from "three";
import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useStarData } from "@/context/StarDataContext";
import { useSetting } from "@/context/SettingContext";
import ConstellationView from "./ConstellationView";
import { SkyOrigin, calcSkyRotationAt, equatorialToVector3 } from "@/utils/celestialSphere";

interface StarFieldProps {
  isVisibleConstellationLines: boolean;
  skyOrigin: SkyOrigin | null;
}

const StarField = ({ isVisibleConstellationLines, skyOrigin }: StarFieldProps) => {
  const pointsRef = useRef<THREE.Points>(null);
  const skyRef = useRef<THREE.Group>(null);
  const { starData, vMagRanges } = useStarData();
  const { contrastValue, starSizeValue } = useSetting();

  // 星は天球に固定した座標で配置し、観測地と時刻による向きは天球ごとの回転で与える。
  // 恒星時は時間とともに進むため、毎フレーム現在時刻で計算し直す。
  useFrame(() => {
    if (!skyRef.current || !skyOrigin) return;

    skyRef.current.setRotationFromMatrix(calcSkyRotationAt(skyOrigin, Date.now()));
  });

  const generateCircleTexture = () => {
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext("2d")!;
	
    // 放射状グラデーションを作成（中心から外側に透明度を上げる）
    const gradient = ctx.createRadialGradient(
      size / 2, size / 2, 0,        // 内側の円（中心点、半径0）
      size / 2, size / 2, size / 2  // 外側の円（中心点、半径は画像の半分）
    );
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");     // 中心：完全に不透明
    gradient.addColorStop(contrastValue * 0.5 + 0.5, "rgba(255, 255, 255, 0.8)"); // 70%地点：少し透明
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");     // 外側：完全に透明
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  const plane = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(1000, 1000);
    const material = new THREE.MeshBasicMaterial({
      color: 0x000000,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.2,
    });
    return (
      <mesh
        geometry={geometry}
        material={material}
        position={[0, -5, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
    );
  }, []);

  useEffect(() => {
    (async () => {
      if (!pointsRef.current || starData.length === 0) return;

      const positions: number[] = [];
      const material = new THREE.PointsMaterial({
        color: 0xffffff,
        size: starSizeValue * 0.02 + 0.08,
        sizeAttenuation: true,
        map: generateCircleTexture(),
        alphaTest: 0.5,
        transparent: true
      });

      starData.filter(
        star => star.vMag >= vMagRanges.min && star.vMag <= vMagRanges.max
      ).forEach((star) => {
        const position = equatorialToVector3(star.rightAscension, star.declination, 10);
        // 暗い星ほど遠くに配置し、sizeAttenuation によって小さく描画させる
        position.multiplyScalar((star.vMag + 1) * 0.5 + 0.8);

        positions.push(position.x, position.y, position.z);
      });

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));

      // 既存のオブジェクトを破棄
      if (pointsRef.current.geometry) pointsRef.current.geometry.dispose();
      if (Array.isArray(pointsRef.current.material)) {
        pointsRef.current.material.forEach((m) => m.dispose());
      } else {
        pointsRef.current.material.dispose();
      }

      pointsRef.current.geometry = geometry;
      pointsRef.current.material = material;
    })();
  }, [vMagRanges, starData]);

  return (
    <>
      {plane}
      <group ref={skyRef}>
        <points ref={pointsRef} />
        {isVisibleConstellationLines && (
          <ConstellationView />
        )}
      </group>
    </>
  );
};

export default StarField;