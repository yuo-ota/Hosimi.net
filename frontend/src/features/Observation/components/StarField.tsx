import * as THREE from "three";
import { useRef, useEffect, useMemo } from "react";
import { useStarData } from "@/context/StarDataContext";
import { useSetting } from "@/context/SettingContext";
import ConstellationView from "./ConstellationView";
import { EquatorialCoords } from "@/type/EquatorialCoords";
import { calcViewCoords } from "@/utils/coordinateUtils";

interface StarFieldProps {
  isVisibleConstellationLines: boolean;
  userEquatorialCoord: EquatorialCoords | null;
}

const StarField = ({ isVisibleConstellationLines, userEquatorialCoord }: StarFieldProps) => {
  const pointsRef = useRef<THREE.Points>(null);
  const { starData, vMagRanges } = useStarData();
  const { contrastValue, starSizeValue } = useSetting();

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

  const material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: starSizeValue * 0.02 + 0.08,
    sizeAttenuation: true,
    map: generateCircleTexture(),
    alphaTest: 0.5,
    transparent: true
  });

  // 天頂ベクトルに対して直交する軸で地平面を計算
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
      if (!pointsRef.current || starData.length === 0 || !userEquatorialCoord) return;

      const positions: number[] = [];
      const sizes: number[] = [];

      // ユーザーの天頂ベクトルを計算（変換後の座標系で）
      let zenithVector: THREE.Vector3;
      if (userEquatorialCoord) {
        // 変換後の座標系では、ユーザーの天頂方向はY軸正方向
        zenithVector = new THREE.Vector3(0, 1, 0);
      } else {
        // デフォルトは天頂をY軸正方向とする
        zenithVector = new THREE.Vector3(0, 1, 0);
      }

      starData.filter(
        star => star.vMag >= vMagRanges.min && star.vMag <= vMagRanges.max
      ).forEach((star) => {
        const radius = 10;
        if (!userEquatorialCoord) {
          return;
        }
        
        const starVector = calcViewCoords(
          star.rightAscension,
          star.declination,
          userEquatorialCoord,
          radius
        );
        // 天頂ベクトルとの内積を計算（0以上なら地平線より上）
        const dotProduct = starVector.dot(zenithVector);
        
        if (starVector.y >= 0) {
          positions.push(starVector.x, starVector.y, starVector.z);
          sizes.push(Math.max(0.1, 5 - star.vMag));
        }
      });

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
      geometry.setAttribute("size", new THREE.Float32BufferAttribute(sizes, 1));

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
  }, [vMagRanges, starData, userEquatorialCoord]);

  // 天頂に赤いポイントを配置（検証用：ユーザーの座標を星の変換処理と同じように処理）
  const zenithPoint = useMemo(() => {
    if (!userEquatorialCoord) {
      // デフォルトは天頂方向（Y軸正方向）に配置
      return (
        <mesh position={[0, 10, 0]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshBasicMaterial color="blue" />
        </mesh>
      );
    }
    const rotatedPosition = calcViewCoords(
      userEquatorialCoord.rightAscension,
      userEquatorialCoord.declination,
      userEquatorialCoord,
      10
    );

    return (
      <mesh position={rotatedPosition}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial color="red" />
      </mesh>
    );
  }, [userEquatorialCoord]);

  return (
    <>
      {/* 地平面は星座の回転とは独立して配置 */}
      {plane}
      <points ref={pointsRef} />
      {isVisibleConstellationLines && (
        <ConstellationView userEquatorialCoord={userEquatorialCoord} />
      )}
    </>
  );
};

export default StarField;