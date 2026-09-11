"use client"

import { createContext, useContext, useState, ReactNode } from "react";
import { GeoLocation, isGeoLocation } from "@/type/GeoLocation";

const USER_POSITION_KEY = "userPosition";

// localStorage はプライベートブラウジングや容量超過で例外を投げることがあるため、
// 失敗しても表示自体は継続できるようにする。
const readStoredPosition = (): GeoLocation | null => {
  if (typeof window === "undefined") return null;

  try {
    const saved = localStorage.getItem(USER_POSITION_KEY);
    if (!saved) return null;

    const parsed: unknown = JSON.parse(saved);
    return isGeoLocation(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

const writeStoredPosition = (position: GeoLocation) => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(USER_POSITION_KEY, JSON.stringify(position));
  } catch {
    // 保存できなくてもこの回の観測は成立するため、次回改めて設定させる
  }
};

// Context の型
type UserPositionContextType = {
  position: GeoLocation | null;
  setPosition: (pos: GeoLocation) => void;
};

// Context の初期値は null で型キャスト
export const UserPositionContext = createContext<UserPositionContextType | undefined>(undefined);

type UserPositionProviderProps = {
  children: ReactNode;
};

export const UserPositionProvider = ({ children }: UserPositionProviderProps) => {
  // 観測画面を直接リロードしても観測地を復元できるようにする
  const [position, setPositionState] = useState<GeoLocation | null>(() => readStoredPosition());

  const setPosition = (pos: GeoLocation) => {
    setPositionState(pos);
    writeStoredPosition(pos);
  };

  return (
    <UserPositionContext.Provider value={{ position, setPosition }}>
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
