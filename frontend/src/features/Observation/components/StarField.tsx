import * as THREE from "three";
import { useRef, useEffect, useMemo } from "react";
import { useStarData } from "@/context/StarDataContext";
import { getStarList } from "@/lib/api/stars";
import { StarData } from "@/type/StarData";

const StarField = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const { starData, vMagRanges } = useStarData();

  const generateCircleTexture = () => {
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  const material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.08,
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
      // if (!pointsRef.current || starData.length === 0) return;
      if (!pointsRef.current) return;

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
        positions.push(x, y, z);
        sizes.push(Math.max(0.1, 5 - star.vMag));
      });

      positions.push(0, 5, -10);
      

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
    </>
  );
};

export default StarField;