"use client"

import { createContext, useContext, useState, ReactNode } from "react";
import { StarData } from "@/type/StarData";
import { VMagRange } from "@/type/VMagRange";

type StarDataContextType = {
  starData: StarData[];
  setStarData: (data: StarData[]) => void;
	vMagRanges: VMagRange[];
	addVMagRanges: (range: VMagRange) => void;
};

const StarDataContext = createContext<StarDataContextType | undefined>(undefined);

type Props = {
  children: ReactNode;
};

export const StarDataProvider = ({ children }: Props) => {
  const [starData, setStarData] = useState<StarData[]>([]);
  const [vMagRanges, setVMagRanges] = useState<VMagRange[]>([]);

  const addVMagRanges = (range: VMagRange) => {
    setVMagRanges(prev => [...prev, range]);
  };

  return (
    <StarDataContext.Provider value={{ starData, setStarData, vMagRanges, addVMagRanges }}>
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