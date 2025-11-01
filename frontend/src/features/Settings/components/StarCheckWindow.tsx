'use client';

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface StarCheckWindowProps {
	preContrastValue: number;
  preStarSizeValue: number;
}

const StarCheckWindow = ({ preContrastValue, preStarSizeValue }: StarCheckWindowProps) => {
	const pointsRef = useRef<THREE.Points>(null!);

	const positions = new Float32Array([0, 0, -5]);
	const geometry = new THREE.BufferGeometry();
	geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

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
	gradient.addColorStop(preContrastValue * 0.5 + 0.5, "rgba(255, 255, 255, 0.8)"); // 70%地点：少し透明
	gradient.addColorStop(1, "rgba(255, 255, 255, 0)");     // 外側：完全に透明
	
	ctx.fillStyle = gradient;
	ctx.beginPath();
	ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
	ctx.fill();

	const texture = new THREE.CanvasTexture(canvas);

	const material = new THREE.PointsMaterial({
		color: 0xffffff,
		size: preStarSizeValue * 0.1 + 0.4,
		sizeAttenuation: true,
		map: texture,
		alphaTest: 0.5,
		transparent: true,
	});

	useEffect(() => {
		(async () => {
			pointsRef.current.geometry = geometry;
			pointsRef.current.material = material;
		})();
	}, [preStarSizeValue, preContrastValue]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <points ref={pointsRef} />
    </>
  );
};

export default StarCheckWindow;
