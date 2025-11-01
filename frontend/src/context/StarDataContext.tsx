"use client"

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { StarData } from "@/type/StarData";
import { Constellation } from "@/type/ConstellationData";
import { VMagRange } from "@/type/VMagRange";
import { getStarList } from "@/lib/api/stars";
import { getConstellations } from "@/lib/api/constellations";

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
  // localStorageから初期値を取得
  const [starData, setStarData] = useState<StarData[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('starData');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [constellationLines, setConstellationLines] = useState<Constellation[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('constellationLines');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [vMagRanges, setVMagRanges] = useState<VMagRange>({ min: -2.0, max: -2.0 });

  useEffect(() => {
    (async () => {
      // データが既に存在する場合はスキップ
      if (starData.length > 0 && constellationLines.length > 0) {
        setVMagRanges({ min: -1.0, max: 3.0 });
        return;
      }

      const [starResult, constellationResult] = await Promise.all([
        getStarList(),
        getConstellations()
      ]);
      
      if (constellationResult.success) {
        setConstellationLines(constellationResult.constellationsData);
        // localStorageに保存
        if (typeof window !== 'undefined') {
          localStorage.setItem('constellationLines', JSON.stringify(constellationResult.constellationsData));
        }
      }
      if (starResult.success) {
        setStarData(starResult.starListData);
        // localStorageに保存
        if (typeof window !== 'undefined') {
          localStorage.setItem('starData', JSON.stringify(starResult.starListData));
        }
      }
    })();
    setVMagRanges({ min: -1.0, max: 3.0 });
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