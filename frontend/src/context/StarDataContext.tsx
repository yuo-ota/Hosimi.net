"use client"

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { StarData } from "@/type/StarData";
import { VMagRange } from "@/type/VMagRange";
import { getStarList } from "@/lib/api/stars";

type StarDataContextType = {
  starData: StarData[];
  vMagRanges: VMagRange;
  setVMagRanges: (ranges: VMagRange) => void;
};

const StarDataContext = createContext<StarDataContextType | undefined>(undefined);

type Props = {
  children: ReactNode;
};

export const StarDataProvider = ({ children }: Props) => {
  const [starData, setStarData] = useState<StarData[]>([]);
  const [vMagRanges, setVMagRanges] = useState<VMagRange>({ min: -2.0, max: -2.0 });

  useEffect(() => {
    (async () => {
      const data = await getStarList();
      if (data.success) {
        setStarData(data.starListData);
      }
    })();
    setVMagRanges({ min: -1.0, max: 3.0 });
  }, []);

  return (
    <StarDataContext.Provider value={{ starData, vMagRanges, setVMagRanges }}>
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