import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { AppSettingsProvider } from "@/context/ThemeContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { View } from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";



export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaProvider>
      <AppSettingsProvider>
        <View
          style={{
            flex: 1,
            paddingTop: insets.top,
          }}
        >
          {/* Status bar OUTSIDE NavigationThemeProvider */}
          <StatusBar translucent style={colorScheme === "dark" ? "light" : "dark"} />

          <NavigationThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
           
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
          </NavigationThemeProvider>
        </View>
      </AppSettingsProvider>
    </SafeAreaProvider>
  );
}
