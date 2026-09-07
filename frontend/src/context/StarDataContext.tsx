"use client"

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { StarData } from "@/type/StarData";
import { Constellation } from "@/type/ConstellationData";
import { VMagRange } from "@/type/VMagRange";
import { getStarList } from "@/lib/api/stars";
import { getConstellations } from "@/lib/api/constellations";
import { DEFAULT_V_MAG_RANGE } from "@/config/starMagnitude";

// 配信するデータの内容やキャッシュの構造を変えたら、この値を上げること。
// 既存ユーザーの localStorage が破棄され、データが再取得される。
// 上げ忘れると、一度キャッシュを持ったユーザーには新しいデータが永久に届かない。
const CACHE_VERSION = "2";

const CACHE_VERSION_KEY = "starDataCacheVersion";
const STAR_DATA_KEY = "starData";
const CONSTELLATION_LINES_KEY = "constellationLines";

// localStorage はプライベートブラウジングや容量超過で例外を投げることがあるため、
// 失敗しても表示自体は継続できるようにする。
const readCache = <T,>(key: string): T[] => {
  if (typeof window === "undefined") return [];

  try {
    // 版が違えば古いキャッシュとみなして捨てる
    if (localStorage.getItem(CACHE_VERSION_KEY) !== CACHE_VERSION) return [];

    const saved = localStorage.getItem(key);
    if (!saved) return [];

    const parsed: unknown = JSON.parse(saved);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
};

const writeCache = (entries: [string, unknown][]) => {
  if (typeof window === "undefined") return;

  try {
    entries.forEach(([key, value]) => localStorage.setItem(key, JSON.stringify(value)));
    // 全て書き込めた後で版を記録する。
    // 先に版を上げると、書き込みに失敗したデータが欠けたまま再取得されなくなる。
    localStorage.setItem(CACHE_VERSION_KEY, CACHE_VERSION);
  } catch {
    // 保存できなくてもこの回の表示は成立するため、次回改めて取得させる
  }
};

type StarDataContextType = {
  starData: StarData[];
  vMagRanges: VMagRange;
  constellationLines: Constellation[];
  setVMagRanges: (ranges: VMagRange) => void;
};

const StarDataContext = createContext<StarDataContextType | undefined>(undefined);

type Props = {
  children: ReactNode;
};

export const StarDataProvider = ({ children }: Props) => {
  const [starData, setStarData] = useState<StarData[]>(() => readCache<StarData>(STAR_DATA_KEY));
  const [constellationLines, setConstellationLines] = useState<Constellation[]>(
    () => readCache<Constellation>(CONSTELLATION_LINES_KEY)
  );
  const [vMagRanges, setVMagRanges] = useState<VMagRange>(DEFAULT_V_MAG_RANGE);

  useEffect(() => {
    // キャッシュから読めていれば取得しない
    if (starData.length > 0 && constellationLines.length > 0) return;

    let cancelled = false;

    (async () => {
      const [starResult, constellationResult] = await Promise.all([
        getStarList(),
        getConstellations()
      ]);

      if (cancelled) return;

      if (starResult.success) setStarData(starResult.starListData);
      if (constellationResult.success) setConstellationLines(constellationResult.constellationsData);

      // 星と星座線は揃って初めて意味を持つため、両方成功したときだけ保存する
      if (starResult.success && constellationResult.success) {
        writeCache([
          [STAR_DATA_KEY, starResult.starListData],
          [CONSTELLATION_LINES_KEY, constellationResult.constellationsData]
        ]);
      }
    })();

    return () => { cancelled = true; };
  }, [starData.length, constellationLines.length]);

  return (
    <StarDataContext.Provider value={{ starData, vMagRanges, constellationLines, setVMagRanges }}>
      {children}
    </StarDataContext.Provider>
  );
};

// Hook で簡単に呼び出せる
export const useStarData = (): StarDataContextType => {
  const context = useContext(StarDataContext);
  if (!context) {
    throw new Error("useStarData must be used within a StarDataProvider");
  }
  return context;
};
