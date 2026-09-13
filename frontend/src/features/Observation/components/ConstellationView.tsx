import { useStarData } from "@/context/StarDataContext";
import { useMemo, useRef, useEffect, Suspense } from "react";
import * as THREE from "three";
import { Billboard, Text } from "@react-three/drei";
import { HORIZON_CLIP_PLANE, equatorialToVector3, getStarPosition } from "@/utils/celestialSphere";

// 星座名を表示する半径。個々の星の等級による距離のばらつきに影響されないよう、
// 星座を構成する星の向きの平均だけを使い、線とは独立した固定値を使う。
const LABEL_RADIUS = 12;

// drei の Text (troika-three-text) はフォントを指定しないと、日本語のような
// ラテン文字以外を検出した際に外部CDN(jsdelivr上のunicode-font-resolver)から
// 対応フォントを取得しようとする。必ずアプリ内蔵のフォントを明示してこれを避ける。
const CONSTELLATION_LABEL_FONT = "/fonts/Senobi-Gothic-Regular.ttf";

type ConstellationViewProps = {
  showNames: boolean;
};

type ConstellationLabel = {
  name: string;
  position: THREE.Vector3;
};

const ConstellationView = ({ showNames }: ConstellationViewProps) => {
  const { starData, constellationLines } = useStarData();
  const linesRef = useRef<THREE.Group>(null!);

  // 星座線のgeometryとmaterial、星座名のラベル位置を作成
  const { geometry, material, labels } = useMemo(() => {
    if (!starData.length || !constellationLines.length) {
      return { geometry: null, material: null, labels: [] as ConstellationLabel[] };
    }

    // starDataをIDでマップ化して高速検索
    const starMap = new Map(starData.map(star => [star.starId.toString(), star]));

    const points: THREE.Vector3[] = [];
    const labels: ConstellationLabel[] = [];

    constellationLines.forEach(constellation => {
      // 星座名のラベル位置を求めるための、星の向き(単位ベクトル)の合計
      const directionSum = new THREE.Vector3();
      let starCount = 0;

      constellation.constellationLines.forEach(line => {
        const startStar = starMap.get(line.startStarId);
        const endStar = starMap.get(line.endStarId);

        if (startStar && endStar) {
          // 星と全く同じ位置計算を使うことで、星座線が星の位置とずれないようにする
          points.push(
            getStarPosition(startStar.rightAscension, startStar.declination, startStar.vMag),
            getStarPosition(endStar.rightAscension, endStar.declination, endStar.vMag)
          );

          directionSum.add(equatorialToVector3(startStar.rightAscension, startStar.declination, 1));
          directionSum.add(equatorialToVector3(endStar.rightAscension, endStar.declination, 1));
          starCount += 2;
        }
      });

      if (starCount > 0 && directionSum.lengthSq() > 0) {
        labels.push({
          name: constellation.constellationName,
          position: directionSum.normalize().multiplyScalar(LABEL_RADIUS),
        });
      }
    });

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: 0xffffff,
      opacity: 0.6,
      transparent: true,
      // 星と同様、地平線より下(y<0)を確実に切り捨てる
      clippingPlanes: [HORIZON_CLIP_PLANE]
    });

    return { geometry, material, labels };
  }, [starData, constellationLines]);

  // Three.jsのlineオブジェクトを更新
  useEffect(() => {
    if (linesRef.current && geometry && material) {
      // 既存の線をクリア
      linesRef.current.clear();

      // 新しい線を追加(LineSegmentsを使用して各ペアを独立した線として描画)
      const lines = new THREE.LineSegments(geometry, material);
      linesRef.current.add(lines);
    }
  }, [geometry, material]);

  return (
    <>
      <group ref={linesRef} />
      {/*
        drei の Text はフォント読み込み中 React Suspense を発生させる。
        ここに Suspense を置かないと、一番近い祖先の Suspense (observation/page.tsx が
        Observation コンポーネント全体を包んでいるもの) まで伝播し、フォント読み込みの
        たびに画面全体(カメラ・ボタンごと)がアンマウント→再マウントされてしまう
        (真っ白/初期ポップアップの再表示という形で観測された)。fallback=null で
        ローカルに閉じ込め、読み込み中は星座名だけを一時的に表示しないようにする。
      */}
      {showNames && (
        <Suspense fallback={null}>
          {labels.map((label) => (
            // Billboard でくるむことで、天球(親の group)の回転によらず常にカメラの方を向かせる
            <Billboard key={label.name} position={label.position}>
              <Text
                font={CONSTELLATION_LABEL_FONT}
                fontSize={0.6}
                color="#ffffff"
                outlineWidth={0.03}
                outlineColor="#000000"
                anchorX="center"
                anchorY="middle"
              >
                {label.name}
              </Text>
            </Billboard>
          ))}
        </Suspense>
      )}
    </>
  );
};

export default ConstellationView;
