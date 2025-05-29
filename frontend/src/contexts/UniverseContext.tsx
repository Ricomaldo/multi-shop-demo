import React, { createContext, useContext, useState } from "react";

export type UniverseType = "brewery" | "teaShop" | "beautyShop" | "herbShop";

interface UniverseContextType {
  universe: UniverseType;
  setUniverse: (universe: UniverseType) => void;
  getColorScheme: () => string;
}

const UniverseContext = createContext<UniverseContextType | undefined>(
  undefined
);

interface UniverseProviderProps {
  children: React.ReactNode;
  defaultUniverse?: UniverseType;
}

export const UniverseProvider: React.FC<UniverseProviderProps> = ({
  children,
  defaultUniverse = "brewery",
}) => {
  const [universe, setUniverse] = useState<UniverseType>(defaultUniverse);

  const getColorScheme = (): string => {
    switch (universe) {
      case "brewery":
        return "orange";
      case "teaShop":
        return "green";
      case "beautyShop":
        return "pink";
      case "herbShop":
        return "teal";
      default:
        return "orange";
    }
  };

  return (
    <UniverseContext.Provider value={{ universe, setUniverse, getColorScheme }}>
      {children}
    </UniverseContext.Provider>
  );
};

export const useUniverse = (): UniverseContextType => {
  const context = useContext(UniverseContext);
  if (!context) {
    throw new Error("useUniverse must be used within UniverseProvider");
  }
  return context;
};
