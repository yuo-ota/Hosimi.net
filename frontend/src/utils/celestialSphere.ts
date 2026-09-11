import * as THREE from "three";
import { GeoLocation } from "@/type/GeoLocation";

// three.js のワールド座標系を観測地の地平座標系として扱う。
//   +X = 東 / +Y = 天頂 / +Z = 南
// これは drei の DeviceOrientationControls が作るカメラ姿勢の基準と一致する。

const UNIX_EPOCH_JULIAN_DATE = 2440587.5;
const J2000_JULIAN_DATE = 2451545.0;

// 0以上360未満に丸める
const normalizeDeg = (deg: number) => ((deg % 360) + 360) % 360;

/**
 * 赤道座標を、天の北極を +Z とする右手系の単位ベクトルに変換する。
 * ここで得られるのは「天球そのものに固定された座標」であり、
 * 観測地・時刻による向きは calcSkyRotation が持つ回転で与える。
 */
export const equatorialToVector3 = (
  rightAscensionDeg: number,
  declinationDeg: number,
  radius = 1
): THREE.Vector3 => {
  const ra = THREE.MathUtils.degToRad(rightAscensionDeg);
  const dec = THREE.MathUtils.degToRad(declinationDeg);

  return new THREE.Vector3(
    radius * Math.cos(dec) * Math.cos(ra),
    radius * Math.cos(dec) * Math.sin(ra),
    radius * Math.sin(dec)
  );
};

/**
 * グリニッジ恒星時(度)を UTC から求める。
 *
 * 天球の向きに必要なのは恒星時だけで、これは UTC のみの関数として閉じているため
 * 外部APIを介さずに求められる。省略している T^2 の項は 2026年時点で 0.00003 度、
 * 10年後でも 0.00005 度であり、肉眼観測では無視できる。
 */
export const calcGreenwichSiderealTimeDeg = (date: Date): number => {
  const julianDate = date.getTime() / 86_400_000 + UNIX_EPOCH_JULIAN_DATE;
  const daysFromJ2000 = julianDate - J2000_JULIAN_DATE;

  return normalizeDeg(280.46061837 + 360.98564736629 * daysFromJ2000);
};

/** 地方恒星時(度) = グリニッジ恒星時 + 経度(東経を正) */
export const calcLocalSiderealTimeDeg = (date: Date, longitudeDeg: number): number =>
  normalizeDeg(calcGreenwichSiderealTimeDeg(date) + longitudeDeg);

/**
 * equatorialToVector3 が返す天球固定の座標を、地平座標系へ移す回転を返す。
 *
 * 1. 天球を極まわりに -地方恒星時 だけ回し、赤経を時角に変える
 *      (x, y, z) -> (cosδcosH, -cosδsinH, sinδ)
 * 2. 時角・赤緯から東/天頂/南の各成分を取り出す
 *      東   E = -cosδsinH        = y
 *      北   N = z*cosφ - x*sinφ
 *      天頂 U = z*sinφ + x*cosφ
 *      ワールド座標は +Z が南なので (E, U, -N) を並べる
 */
export const calcSkyRotation = (
  localSiderealTimeDeg: number,
  latitudeDeg: number
): THREE.Matrix4 => {
  const lat = THREE.MathUtils.degToRad(latitudeDeg);
  const cosLat = Math.cos(lat);
  const sinLat = Math.sin(lat);

  // 時角・赤緯 -> 地平座標
  const toHorizontal = new THREE.Matrix4().set(
    0, 1, 0, 0,
    cosLat, 0, sinLat, 0,
    sinLat, 0, -cosLat, 0,
    0, 0, 0, 1
  );

  // 赤経 -> 時角
  const spin = new THREE.Matrix4().makeRotationZ(
    -THREE.MathUtils.degToRad(localSiderealTimeDeg)
  );

  return toHorizontal.multiply(spin);
};

/**
 * その時刻・その観測地における天球の回転を返す。
 * 恒星時は1分で約0.25度進むため、描画のたびに現在時刻で求め直す。
 */
export const calcSkyRotationAt = (position: GeoLocation, date: Date): THREE.Matrix4 =>
  calcSkyRotation(calcLocalSiderealTimeDeg(date, position.longitude), position.latitude);
