import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

type ThemeType = "auto" | "light" | "dark";

interface AppSettingsContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => Promise<void>;

  autoFlash: boolean;
  setAutoFlash: (value: boolean) => Promise<void>;

  autoOpenURL: boolean;
  setAutoOpenURL: (value: boolean) => Promise<void>;
}

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined);

export function AppSettingsProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeType>("auto");
  const [autoFlash, setAutoFlashState] = useState(true);
  const [autoOpenURL, setAutoOpenURLState] = useState(true);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem("theme");
      const savedFlash = await AsyncStorage.getItem("autoFlash");
      const savedAutoURL = await AsyncStorage.getItem("autoOpenURL");

      if (savedTheme) setThemeState(savedTheme as ThemeType);
      if (savedFlash) setAutoFlashState(savedFlash === "true");
      if (savedAutoURL) setAutoOpenURLState(savedAutoURL === "true");
    } catch (error) {
      console.error("Failed to load settings");
    } finally {
      setIsLoading(false);
    }
  };

  const setTheme = async (newTheme: ThemeType) => {
    setThemeState(newTheme);
    await AsyncStorage.setItem("theme", newTheme);
  };

  const setAutoFlash = async (value: boolean) => {
    setAutoFlashState(value);
    await AsyncStorage.setItem("autoFlash", value.toString());
  };

  const setAutoOpenURL = async (value: boolean) => {
    setAutoOpenURLState(value);
    await AsyncStorage.setItem("autoOpenURL", value.toString());
  };

  if (isLoading) return null;

  return (
    <AppSettingsContext.Provider
      value={{
        theme,
        setTheme,

        autoFlash,
        setAutoFlash,

        autoOpenURL,
        setAutoOpenURL,
      }}
    >
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings() {
  const context = useContext(AppSettingsContext);
  if (!context) {
    throw new Error("useAppSettings must be used inside AppSettingsProvider");
  }
  return context;
}
