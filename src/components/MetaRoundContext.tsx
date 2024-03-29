import React, { createContext, useContext, useEffect, useState } from "react";

interface MetaRoundContextProps {
  currentMetaRound: number;
  setCurrentMetaRound: React.Dispatch<React.SetStateAction<number>>;
}

const MetaRoundContext = createContext<MetaRoundContextProps | undefined>(
  undefined
);

const usePersistedState = <T,>(
  key: string,
  defaultValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [state, setState] = useState<T>(() => {
    try {
      const savedState = window.localStorage.getItem(key);
      if (savedState) {
        return JSON.parse(savedState);
      }
    } catch (err) {
      // If the JSON is malformed or it's an empty document it will fall in this block
      console.error(
        `Error parsing state for key "${key}" from localstorage`,
        err
      );
    }
    return defaultValue; // If no valid data was found, return the default value
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
};

export const useMetaRound = () => {
  const context = useContext(MetaRoundContext);
  if (!context) {
    throw new Error("useMetaRound must be used within a MetaRoundProvider");
  }
  return context;
};

export const MetaRoundProvider: React.FC = ({ children }) => {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const [currentMetaRound, setCurrentMetaRound] = usePersistedState<number>(
    `metaRound-${today}`,
    1
  );

  return (
    <MetaRoundContext.Provider
      value={{ currentMetaRound, setCurrentMetaRound }}
    >
      {children}
    </MetaRoundContext.Provider>
  );
};
