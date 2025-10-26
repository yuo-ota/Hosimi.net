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
  const [position, setPosition] = useState<Geolocation | null>(null);

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
