"use client";
import { createContext, useContext, useState } from "react";

const AppContext = createContext<any>(0);

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const [count, setCount] = useState(0);
  const [itemsCount, setItemCount] = useState(0);

  return (
    <AppContext.Provider
      value={{
        count,
        setCount,
        itemsCount,
        setItemCount
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
