import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet, View, useColorScheme } from "react-native";


export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        }}
      >
        {/* GENERATE */}
        <Tabs.Screen
          name="index"
          options={{
            title: "Generate",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="qr-code-outline" size={size} color={color} />
            ),
          }}
        />
        {/* SCAN */}
        <Tabs.Screen
          name="scan"
          options={{
            title: "Scan",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="scan-outline" size={size} color={color} />
            ),
          }}
        />

        {/* HISTORY */}
        <Tabs.Screen
          name="history"
          options={{
            title: "History",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="time-outline" size={size} color={color} />
            ),
          }}
        />

        {/* SETTINGS */}
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings-outline" size={size} color={color} />
            ),
          }}
        />
      </Tabs>

      {/* ⭐ GLOBAL BANNER AD BELOW TABS */}
    </View>
  );
}

const styles = StyleSheet.create({
  bannerContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    paddingBottom: 4,
  },
});
