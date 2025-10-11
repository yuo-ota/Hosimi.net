import * as THREE from "three";
import { EquatorialCoords } from "@/type/EquatorialCoords";

/**
 * 星または天頂点をユーザー視点に変換する関数
 * @param raDeg 星の赤経 [度]
 * @param decDeg 星の赤緯 [度]  
 * @param userEquatorialCoord ユーザーの赤道座標
 * @param radius 距離（デフォルト: 10）
 * @returns 変換後のThree.jsのVector3座標
 */
export function calcViewCoords(
  raDeg: number,
  decDeg: number,
  userEquatorialCoord: EquatorialCoords,
  radius: number = 10
): THREE.Vector3 {
  const starRa = (raDeg * Math.PI) / 180;
  const starDec = (decDeg * Math.PI) / 180;
  const userRa = (userEquatorialCoord.rightAscension * Math.PI) / 180;
  const userDec = (userEquatorialCoord.declination * Math.PI) / 180;

  // -------------------------------
  // 1️⃣ 星の初期座標（天球座標系）
  // -------------------------------
  let x = radius * Math.cos(starDec) * Math.cos(starRa);
  let y = radius * Math.cos(starDec) * Math.sin(starRa);
  let z = radius * Math.sin(starDec);

  // -------------------------------
  // 2️⃣ Z軸回転：ユーザーの赤経を基準に回転
  // -------------------------------
  const rotZ = -userRa; // ユーザーの赤経分だけ逆回転
  {
    const cosTheta = Math.cos(rotZ);
    const sinTheta = Math.sin(rotZ);
    const newX = x * cosTheta - y * sinTheta;
    const newY = x * sinTheta + y * cosTheta;
    x = newX;
    y = newY;
  }

  // -------------------------------
  // 3️⃣ X軸回転：ユーザーの天頂をY軸正方向に
  // -------------------------------
  const rotX = -Math.PI / 2 + userDec;
  {
    const cosPhi = Math.cos(rotX);
    const sinPhi = Math.sin(rotX);
    const newY = y * cosPhi - z * sinPhi;
    const newZ = y * sinPhi + z * cosPhi;
    y = newY;
    z = newZ;
  }

  return new THREE.Vector3(x, y, z);
}