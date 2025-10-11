"use client"

import { createContext, useContext, useState, ReactNode } from "react";
import { Geolocation } from "@/type/GeoLocation";

// Context の型
type UserPositionContextType = {
  position: Geolocation | null;
  setPosition: (pos: Geolocation) => void;
};

// Context の初期値は null で型キャスト
export const UserPositionContext = createContext<UserPositionContextType | undefined>(undefined);

type UserPositionProviderProps = {
  children: ReactNode;
};

export const UserPositionProvider = ({ children }: UserPositionProviderProps) => {
  // localStorageから初期値を取得
  const [position, setPosition] = useState<Geolocation | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('userPosition');
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });

  // 位置情報を更新する関数（localStorageにも保存）
  const updatePosition = (pos: Geolocation) => {
    setPosition(pos);
    if (typeof window !== 'undefined') {
      localStorage.setItem('userPosition', JSON.stringify(pos));
    }
  };

  return (
    <UserPositionContext.Provider value={{ position, setPosition: updatePosition }}>
      {children}
    </UserPositionContext.Provider>
  );
};

export const useUserPosition = (): UserPositionContextType => {
  const context = useContext(UserPositionContext);
  if (!context) {
    throw new Error("useUserPosition must be used within a UserPositionProvider");
  }
  return context;
};
