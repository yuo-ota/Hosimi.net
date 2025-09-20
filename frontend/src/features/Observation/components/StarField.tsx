import * as THREE from "three";
import { useRef, useEffect } from "react";
import { useStarData } from "@/context/StarDataContext";
import { getStarList } from "@/lib/api/stars";
import { StarData } from "@/type/StarData";

const StarField = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const { starData } = useStarData();

  useEffect(() => {
    const run = async () => {
      if (!pointsRef.current || starData.length === 0) return;

      const positions: number[] = [];
      const sizes: number[] = [];

      starData.forEach((star) => {
        const dec = (star.declination * Math.PI) / 180;
        const ra = (star.rightAscension * Math.PI) / 180;
        const radius = 10;
        const x = radius * Math.cos(dec) * Math.cos(ra);
        const y = radius * Math.sin(dec);
        const z = radius * Math.cos(dec) * Math.sin(ra);
        positions.push(x, y, z);
        sizes.push(Math.max(0.1, 5 - star.vMag));
      });

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
      geometry.setAttribute("size", new THREE.Float32BufferAttribute(sizes, 1));

      const material = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.08,
        sizeAttenuation: true,
      });

      // 既存のオブジェクトを破棄
      if (pointsRef.current.geometry) pointsRef.current.geometry.dispose();
      if (Array.isArray(pointsRef.current.material)) {
        pointsRef.current.material.forEach((m) => m.dispose());
      } else {
        pointsRef.current.material.dispose();
      }

      pointsRef.current.geometry = geometry;
      pointsRef.current.material = material;
    };

    run();
  }, [starData]); // starData が変わるたびに更新

  return <points ref={pointsRef} />;
};

export default StarField;