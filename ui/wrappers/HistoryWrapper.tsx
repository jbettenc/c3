import { useRouter } from "next/router";
import React, { createContext, useEffect, useContext } from "react";
import { useStateWithSessionStorage } from "@/utils/hooks/sessionStorage";

interface HValidation {
  initialized: boolean;
  history: string[];
  setHistory(data: string[]): void;
  back(): void;
}

const HistoryContext = createContext<HValidation>({} as HValidation);
export const HistoryProvider: React.FC<{ children: any }> = ({ children }) => {
  const { asPath, push, pathname } = useRouter();
  const [initialized, history, setHistory] = useStateWithSessionStorage<string[]>("history", []);

  function back(fallbackRoute?: string) {
    for (let i = history.length - 2; i >= 0; i--) {
      const route = history[i];
      console.log({ route, pathname });
      if (!route.includes("#") && route !== pathname) {
        push(route);
        const newHistory = history.slice(0, i);
        setHistory(newHistory);
        return;
      }
    }
    if (fallbackRoute) {
      push(fallbackRoute);
    }
  }

  useEffect(() => {
    if (!initialized) {
      return;
    }
    if (history[history.length - 1] !== asPath) {
      setHistory([...history, asPath]);
    }
  }, [asPath, initialized]);

  return (
    <HistoryContext.Provider
      value={{
        initialized,
        back,
        history,
        setHistory
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
};

export function useHistory(): HValidation {
  const context = useContext(HistoryContext);
  return context;
}
