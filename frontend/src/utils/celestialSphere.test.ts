import { describe, expect, it } from "vitest";
import * as THREE from "three";
import {
  calcLocalSiderealTimeDeg,
  calcSkyRotation,
  calcSkyRotationAt,
  equatorialToVector3,
} from "./celestialSphere";

// ワールド座標系は +X = 東 / +Y = 天頂 / +Z = 南
const EAST = new THREE.Vector3(1, 0, 0);
const ZENITH = new THREE.Vector3(0, 1, 0);
const SOUTH = new THREE.Vector3(0, 0, 1);

const toDeg = THREE.MathUtils.radToDeg;
const toRad = THREE.MathUtils.degToRad;

// 赤道座標を地平座標系のワールド座標に変換する
const project = (raDeg: number, decDeg: number, lstDeg: number, latDeg: number) =>
  equatorialToVector3(raDeg, decDeg).applyMatrix4(calcSkyRotation(lstDeg, latDeg));

// 地平座標の変換式から直接求めた期待値
const expectedByFormula = (raDeg: number, decDeg: number, lstDeg: number, latDeg: number) => {
  const hourAngle = toRad(lstDeg - raDeg);
  const dec = toRad(decDeg);
  const lat = toRad(latDeg);

  const east = -Math.cos(dec) * Math.sin(hourAngle);
  const north = Math.sin(dec) * Math.cos(lat) - Math.cos(dec) * Math.cos(hourAngle) * Math.sin(lat);
  const zenith = Math.sin(dec) * Math.sin(lat) + Math.cos(dec) * Math.cos(hourAngle) * Math.cos(lat);

  return new THREE.Vector3(east, zenith, -north);
};

describe("calcSkyRotation", () => {
  it("天の北極の高度が観測地の緯度に等しく、真北に見える", () => {
    const latitude = 35;
    // 赤緯90度の天体は赤経によらず天の北極
    const pole = project(0, 90, 123, latitude);

    expect(toDeg(Math.asin(pole.y))).toBeCloseTo(latitude, 6);
    // 北 = -Z
    expect(pole.z).toBeLessThan(0);
    expect(pole.x).toBeCloseTo(0, 6);
  });

  it("赤道上で天の北極が北の地平線上に来る", () => {
    const pole = project(0, 90, 200, 0);

    expect(pole.dot(ZENITH)).toBeCloseTo(0, 6);
    expect(pole.dot(SOUTH)).toBeCloseTo(-1, 6);
  });

  it("子午線上(時角0)の天体は真南に見える", () => {
    // 地方恒星時と赤経が等しい天体が子午線上にある
    const star = project(80, 0, 80, 35);

    expect(star.dot(EAST)).toBeCloseTo(0, 6);
    // 緯度35度から見た赤緯0度の南中高度は 90 - 35 = 55度
    expect(toDeg(Math.asin(star.y))).toBeCloseTo(55, 6);
    expect(star.dot(SOUTH)).toBeGreaterThan(0);
  });

  it("東西が反転していない（時角が負の天体は東、正の天体は西に見える）", () => {
    // 時角 -90度 = まだ南中していない = 東
    expect(project(170, 0, 80, 35).dot(EAST)).toBeCloseTo(1, 6);
    // 時角 +90度 = 南中を過ぎた = 西
    expect(project(350, 0, 80, 35).dot(EAST)).toBeCloseTo(-1, 6);
  });

  it("地平座標の変換式と一致する", () => {
    const cases = [
      { ra: 0, dec: 0, lst: 0, lat: 0 },
      { ra: 37.95, dec: 89.26, lst: 210.4, lat: 35.68 },
      { ra: 279.23, dec: 38.78, lst: 12.5, lat: -33.87 },
      { ra: 101.29, dec: -16.72, lst: 300, lat: 51.5 },
      { ra: 213.92, dec: 19.18, lst: 95.6, lat: -90 },
    ];

    cases.forEach(({ ra, dec, lst, lat }) => {
      const actual = project(ra, dec, lst, lat);
      const expected = expectedByFormula(ra, dec, lst, lat);

      expect(actual.x).toBeCloseTo(expected.x, 6);
      expect(actual.y).toBeCloseTo(expected.y, 6);
      expect(actual.z).toBeCloseTo(expected.z, 6);
    });
  });

  it("回転なので天体どうしの角距離を変えない", () => {
    const a = equatorialToVector3(30, 20);
    const b = equatorialToVector3(80, -10);
    const rotation = calcSkyRotation(137, 35);

    const before = a.angleTo(b);
    const after = a.clone().applyMatrix4(rotation).angleTo(b.clone().applyMatrix4(rotation));

    expect(after).toBeCloseTo(before, 10);
  });
});

describe("恒星時", () => {
  it("J2000.0元期のグリニッジ恒星時が既知の値になる", () => {
    // 2000-01-01 12:00 UT のグリニッジ恒星時は約 280.46 度
    expect(calcLocalSiderealTimeDeg(new Date("2000-01-01T12:00:00Z"), 0)).toBeCloseTo(280.46, 2);
  });

  it("経度を足した地方恒星時になる", () => {
    const date = new Date("2026-09-07T17:58:00Z");
    const greenwich = calcLocalSiderealTimeDeg(date, 0);

    expect(calcLocalSiderealTimeDeg(date, 135)).toBeCloseTo((greenwich + 135) % 360, 6);
  });

  it("1分で約0.25度進む", () => {
    const at = new Date("2026-09-07T17:58:00Z");
    const oneMinuteLater = new Date(at.getTime() + 60_000);

    const advanced =
      calcLocalSiderealTimeDeg(oneMinuteLater, 135) - calcLocalSiderealTimeDeg(at, 135);

    expect(advanced).toBeCloseTo(0.25068, 5);
  });

  it("常に0以上360未満に収まる", () => {
    // 1年ぶんを1時間刻みで確認する
    const start = Date.parse("2026-01-01T00:00:00Z");

    for (let hour = 0; hour < 24 * 365; hour += 1) {
      const lst = calcLocalSiderealTimeDeg(new Date(start + hour * 3_600_000), -175);

      expect(lst).toBeGreaterThanOrEqual(0);
      expect(lst).toBeLessThan(360);
    }
  });
});

describe("calcSkyRotationAt", () => {
  it("その時刻の地方恒星時で天球を回す", () => {
    const position = { latitude: 35.68, longitude: 139.77 };
    const at = new Date("2026-09-07T17:58:00Z");

    const star = equatorialToVector3(37.95, 89.26).applyMatrix4(calcSkyRotationAt(position, at));
    const expected = equatorialToVector3(37.95, 89.26).applyMatrix4(
      calcSkyRotation(calcLocalSiderealTimeDeg(at, position.longitude), position.latitude)
    );

    expect(star.distanceTo(expected)).toBeCloseTo(0, 10);
  });

  it("北極星がほぼ真北・高度=緯度の位置に来る", () => {
    // ポラリス (赤経 37.95度 / 赤緯 89.26度) は天の北極から約0.74度しか離れていない
    const position = { latitude: 35.68, longitude: 139.77 };
    const polaris = equatorialToVector3(37.95, 89.26).applyMatrix4(
      calcSkyRotationAt(position, new Date("2026-09-07T17:58:00Z"))
    );

    const altitude = toDeg(Math.asin(polaris.y));
    // 方位角は北(-Z)から東(+X)まわり
    const azimuth = (toDeg(Math.atan2(polaris.x, -polaris.z)) + 360) % 360;

    expect(Math.abs(altitude - position.latitude)).toBeLessThan(1);
    expect(Math.min(azimuth, 360 - azimuth)).toBeLessThan(1);
  });
});
