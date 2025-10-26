import * as THREE from "three";
import { useRef, useEffect, useMemo } from "react";
import { useStarData } from "@/context/StarDataContext";
import { useSetting } from "@/context/SettingContext";
import ConstellationView from "./ConstellationView";

interface StarFieldProps {
  isVisibleConstellationLines: boolean;
}

const StarField = ({ isVisibleConstellationLines }: StarFieldProps) => {
  const pointsRef = useRef<THREE.Points>(null);
  const { starData, vMagRanges, constellationLines } = useStarData();
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
      const sizes: number[] = [];

      starData.filter(
        star => star.vMag >= vMagRanges.min && star.vMag <= vMagRanges.max
      ).forEach((star) => {
        const dec = (star.declination * Math.PI) / 180;
        const ra = (star.rightAscension * Math.PI) / 180;
        const radius = 10;
        const x = radius * Math.cos(dec) * Math.cos(ra);
        const y = radius * Math.sin(dec);
        const z = radius * Math.cos(dec) * Math.sin(ra);

        if (y > 0) {
          positions.push(x, y, z);
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
  }, [vMagRanges, starData]);

  return (
    <>
      {plane}
      <points ref={pointsRef} />
      {isVisibleConstellationLines && (
        <ConstellationView　/>
      )}
    </>
  );
};

export default StarField;