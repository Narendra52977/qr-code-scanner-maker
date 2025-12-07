import { useAppSettings } from "@/context/ThemeContext";
import { useColorScheme } from "react-native";

export function useAppTheme() {
  const { theme } = useAppSettings();
  const systemScheme = useColorScheme();
  const isDark = theme === "auto" ? systemScheme === "dark" : theme === "dark";

  // Color scheme based on theme
  const colors = {
    bg: isDark ? "#080B16" : "#f4f4f4",
    text: isDark ? "#fff" : "#000",
    secondaryText: isDark ? "#999" : "#666",
    sectionBg: isDark ? "rgba(0, 255, 136, 0.05)" : "rgba(0, 255, 136, 0.08)",
    sectionBorder: isDark ? "rgba(0, 255, 136, 0.2)" : "rgba(0, 255, 136, 0.3)",
    inputBg: isDark ? "#111827" : "#fff",
    inputBorder: isDark ? "#1F2937" : "#e0e0e0",
    infoBg: isDark ? "rgba(0, 163, 255, 0.1)" : "rgba(0, 163, 255, 0.15)",
    infoBorder: isDark ? "rgba(0, 163, 255, 0.3)" : "rgba(0, 163, 255, 0.4)",
    cardBg: isDark ? "rgba(0, 255, 136, 0.05)" : "rgba(0, 255, 136, 0.08)",
    cardBorder: isDark ? "rgba(0, 255, 136, 0.2)" : "rgba(0, 255, 136, 0.3)",
    chevronColor: isDark ? "#666" : "#999",
  };

  return { theme, isDark, colors };
}
