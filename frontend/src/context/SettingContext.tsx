"use client"

import { createContext, useContext, useState, ReactNode } from "react";

type SettingContextType = {
  contrastValue: number;
  starSizeValue: number;
	setContrastValue: (value: number) => void;
  setStarSizeValue: (value: number) => void;
};

const SettingContext = createContext<SettingContextType | undefined>(undefined);

type Props = {
  children: ReactNode;
};

export const SettingProvider = ({ children }: Props) => {
  // localStorageから初期値を取得、なければデフォルト値を使用
  const [contrastValue, setContrastValue] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('contrastValue');
      return saved ? parseFloat(saved) : 0.5;
    }
    return 0.5;
  });

  const [starSizeValue, setStarSizeValue] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('starSizeValue');
      return saved ? parseFloat(saved) : 2.5; // デフォルト値を0から2.5に変更
    }
    return 2.5;
  });

  // 値が変更されたときにlocalStorageに保存
  const handleSetContrastValue = (value: number) => {
    setContrastValue(value);
    if (typeof window !== 'undefined') {
      localStorage.setItem('contrastValue', value.toString());
    }
  };

  const handleSetStarSizeValue = (value: number) => {
    setStarSizeValue(value);
    if (typeof window !== 'undefined') {
      localStorage.setItem('starSizeValue', value.toString());
    }
  };

  return (
    <SettingContext.Provider
      value={{
        contrastValue,
        starSizeValue,
        setContrastValue: handleSetContrastValue,
        setStarSizeValue: handleSetStarSizeValue,
      }}
    >
      {children}
    </SettingContext.Provider>
  );
};

// Hook で簡単に呼び出せる
export const useSetting = (): SettingContextType => {
  const context = useContext(SettingContext);
  if (!context) {
    throw new Error("useSetting must be used within a SettingProvider");
  }
  return context;
};