import { useAppSettings } from "@/context/ThemeContext";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect } from "react";
import {
  Linking,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";

export default function Settings() {
  // Toggles
  // const [autoOpenURL, setAutoOpenURL] = useState(false);
  // const [autoFlash, setAutoFlash] = useState(false);

 
  const { theme, setTheme, autoOpenURL, setAutoOpenURL, autoFlash, setAutoFlash } =
    useAppSettings();

  const systemScheme = useColorScheme();
  const { isDark, colors } = useAppTheme();

  // Load saved settings
  useEffect(() => {
    (async () => {
      const s1 = await AsyncStorage.getItem("autoOpenURL");
      const s2 = await AsyncStorage.getItem("autoFlash");
      const s3 = await AsyncStorage.getItem("theme");

      if (s1 !== null) setAutoOpenURL(s1 === "true");
      if (s2 !== null) setAutoFlash(s2 === "true");
      if (s3 !== null) setTheme(s3 as any);
    })();
  }, []);

  // Save settings when changed
  const updateSetting = async (key: string, value: any) => {
    await AsyncStorage.setItem(key, value.toString());
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: isDark ? "#080B16" : "#f4f4f4" }]}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}
      <View style={styles.headerSection}>
        <Text style={[styles.pageTitle, { color: isDark ? "#fff" : "#000" }]}>Settings</Text>
        <Text style={[styles.pageSubtitle, { color: isDark ? "#999" : "#666" }]}>
          Customize your experience
        </Text>
      </View>

      {/* SCANNER SECTION */}
      <View
        style={[
          styles.section,
          { backgroundColor: isDark ? "rgba(0, 255, 136, 0.05)" : "rgba(0, 255, 136, 0.08)" },
        ]}
      >
        <View style={styles.sectionHeader}>
          <Ionicons name="scan" size={20} color="#00B366" />
          <Text style={[styles.sectionTitle, { color: isDark ? "#fff" : "#000" }]}>Scanner</Text>
        </View>

        {/* Auto-open URLs */}
        <View style={[styles.settingRow, { borderBottomColor: isDark ? "#1F2937" : "#e0e0e0" }]}>
          <View style={styles.settingContent}>
            <Text style={[styles.settingLabel, { color: isDark ? "#fff" : "#000" }]}>
              Auto-open URLs
            </Text>
            <Text style={[styles.settingDescription, { color: isDark ? "#666" : "#888" }]}>
              Automatically open detected URLs
            </Text>
          </View>
          <Switch
            value={autoOpenURL}
            onValueChange={v => {
              setAutoOpenURL(v);
              updateSetting("autoOpenURL", v);
            }}
            trackColor={{ false: "#ccc", true: "#00B366" }}
            thumbColor={autoOpenURL ? "#00FF88" : "#f4f3f4"}
          />
        </View>

        {/* Auto Flash in Dark */}
        <View style={styles.settingRow}>
          <View style={styles.settingContent}>
            <Text style={[styles.settingLabel, { color: isDark ? "#fff" : "#000" }]}>
              Auto Flash in Dark
            </Text>
            <Text style={[styles.settingDescription, { color: isDark ? "#666" : "#888" }]}>
              Enable flash in low light conditions
            </Text>
          </View>
          <Switch
            value={autoFlash}
            onValueChange={v => {
              setAutoFlash(v);
              updateSetting("autoFlash", v);
            }}
            trackColor={{ false: "#ccc", true: "#00B366" }}
            thumbColor={autoFlash ? "#00FF88" : "#f4f3f4"}
          />
        </View>
      </View>

      {/* APPEARANCE SECTION */}
      <View
        style={[
          styles.section,
          { backgroundColor: isDark ? "rgba(0, 163, 255, 0.05)" : "rgba(0, 163, 255, 0.08)" },
        ]}
      >
        <View style={styles.sectionHeader}>
          <Ionicons name="contrast" size={20} color="#00A3FF" />
          <Text style={[styles.sectionTitle, { color: isDark ? "#fff" : "#000" }]}>Appearance</Text>
        </View>

        <Text style={[styles.themeLabel, { color: isDark ? "#999" : "#666" }]}>Theme</Text>

        <View style={styles.themeContainer}>
          {[
            { value: "auto" as const, label: "Auto", icon: "settings" },
            { value: "light" as const, label: "Light", icon: "sunny" },
            { value: "dark" as const, label: "Dark", icon: "moon" },
          ].map(t => (
            <TouchableOpacity
              key={t.value}
              onPress={() => {
                setTheme(t.value);
                updateSetting("theme", t.value);
              }}
              style={[
                styles.themeButton,
                theme === t.value && {
                  backgroundColor: isDark ? "#00B366" : "#00A3FF",
                  borderColor: isDark ? "#00FF88" : "#00CCFF",
                },
                {
                  borderColor: isDark ? "#1F2937" : "#e0e0e0",
                },
              ]}
            >
              <Ionicons
                name={t.icon}
                size={24}
                color={theme === t.value ? (isDark ? "#000" : "#fff") : isDark ? "#666" : "#999"}
              />
              <Text
                style={[
                  styles.themeButtonText,
                  {
                    color:
                      theme === t.value ? (isDark ? "#000" : "#fff") : isDark ? "#fff" : "#333",
                    fontWeight: theme === t.value ? "700" : "600",
                  },
                ]}
              >
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ABOUT SECTION */}
      <View
        style={[
          styles.section,
          { backgroundColor: isDark ? "rgba(100, 150, 200, 0.05)" : "rgba(100, 150, 200, 0.08)" },
        ]}
      >
        <View style={styles.sectionHeader}>
          <Ionicons name="information-circle" size={20} color="#8B5CF6" />
          <Text style={[styles.sectionTitle, { color: isDark ? "#fff" : "#000" }]}>About</Text>
        </View>

        <View style={[styles.aboutItem, { borderBottomColor: isDark ? "#1F2937" : "#e0e0e0" }]}>
          <Text style={[styles.aboutLabel, { color: isDark ? "#999" : "#666" }]}>Version</Text>
          <Text style={[styles.aboutValue, { color: isDark ? "#fff" : "#000" }]}>1.0.0</Text>
        </View>

        <View style={[styles.aboutItem, { borderBottomColor: isDark ? "#1F2937" : "#e0e0e0" }]}>
          <Text style={[styles.aboutLabel, { color: isDark ? "#999" : "#666" }]}>Developer</Text>
          <Text style={[styles.aboutValue, { color: isDark ? "#fff" : "#000" }]}>
            Narendra Balaga
          </Text>
        </View>
      </View>

      {/* SUPPORT SECTION */}
      <View
        style={[
          styles.section,
          { backgroundColor: isDark ? "rgba(220, 100, 100, 0.05)" : "rgba(220, 100, 100, 0.08)" },
        ]}
      >
        <View style={styles.sectionHeader}>
          <Ionicons name="help-circle" size={20} color="#EF4444" />
          <Text style={[styles.sectionTitle, { color: isDark ? "#fff" : "#000" }]}>
            Support & Links
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.linkRow, { borderBottomColor: isDark ? "#1F2937" : "#e0e0e0" }]}
          onPress={() => Linking.openURL("mailto:qrcodeapphello@gmail.com")}
        >
          <View style={styles.linkContent}>
            <Ionicons name="mail" size={18} color="#00A3FF" />
            <Text style={[styles.linkText, { color: isDark ? "#fff" : "#000" }]}>
              Contact Support
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={isDark ? "#666" : "#999"} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.linkRow, { borderBottomColor: isDark ? "#1F2937" : "#e0e0e0" }]}
          onPress={() =>
            Linking.openURL("https://sites.google.com/view/qr-scanner-generator-privacy-p/home")
          }
        >
          <View style={styles.linkContent}>
            <Ionicons name="shield-checkmark" size={18} color="#00B366" />
            <Text style={[styles.linkText, { color: isDark ? "#fff" : "#000" }]}>
              Privacy Policy
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={isDark ? "#666" : "#999"} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkRow}
          onPress={() =>
            Linking.openURL("https://play.google.com/store/apps/details?id=com.qrscan.generator")
          }
        >
          <View style={styles.linkContent}>
            <Ionicons name="star" size={18} color="#FFB800" />
            <Text style={[styles.linkText, { color: isDark ? "#fff" : "#000" }]}>
              Rate This App
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={isDark ? "#666" : "#999"} />
        </TouchableOpacity>
      </View>

      {/* FOOTER */}
      <Text style={[styles.footer, { color: isDark ? "#555" : "#999" }]}>
        QR Code Scanner v1.0.0
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  headerSection: {
    marginBottom: 28,
    paddingTop: 8,
  },

  pageTitle: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 6,
  },

  pageSubtitle: {
    fontSize: 14,
    fontWeight: "500",
  },

  section: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(0, 255, 136, 0.2)",
    padding: 16,
    marginBottom: 20,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
  },

  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
  },

  settingContent: {
    flex: 1,
    marginRight: 12,
  },

  settingLabel: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },

  settingDescription: {
    fontSize: 12,
    fontWeight: "500",
  },

  themeLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 12,
    textTransform: "uppercase",
  },

  themeContainer: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
  },

  themeButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    gap: 8,
  },

  themeButtonText: {
    fontSize: 13,
    fontWeight: "600",
  },

  aboutItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
  },

  aboutLabel: {
    fontSize: 14,
    fontWeight: "600",
  },

  aboutValue: {
    fontSize: 14,
    fontWeight: "600",
  },

  linkRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
  },

  linkContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },

  linkText: {
    fontSize: 15,
    fontWeight: "600",
  },

  footer: {
    textAlign: "center",
    fontSize: 12,
    fontWeight: "500",
    marginVertical: 28,
  },
});
