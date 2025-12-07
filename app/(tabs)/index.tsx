// import { BannerAdComponent } from "@/components/BannerAd";
import { AdLoadingOverlay } from "@/components/AdLoadingOverlay";
import { useAdManager } from "@/hooks/useAdManager";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Clipboard from "expo-clipboard";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function GenerateScreen() {
  const [text, setText] = useState("");
  const [value, setValue] = useState("");
  const [qrGenerated, setQrGenerated] = useState(false);
  const [theme, setTheme] = useState<"auto" | "light" | "dark">("auto");
  const [adLoading, setAdLoading] = useState(false);
  // const { showRewardedAd, showInterstitialAd } = useAdManager({...})
  const { showRewardedAd, showInterstitialAd } = useAdManager({
    onRewardEarned: () => finishGenerate(),
    onAdClosed: () => finishGenerate(),
    onAdFailed: () => {
      setAdLoading(false);
      if (qrGenerated) finishGenerate();
    },
  });

  const systemScheme = useColorScheme();
  const { isDark } = useAppTheme();

  // Load theme setting
  useEffect(() => {
    (async () => {
      const savedTheme = await AsyncStorage.getItem("theme");
      if (savedTheme) setTheme(savedTheme as any);
    })();
  }, []);

  const finishGenerate = () => {
    setAdLoading(false);
    setQrGenerated(true);
  };

  const handleGenerate = () => {
    if (!text.trim()) {
      Alert.alert("Error", "Please enter some text to generate QR code");
      return;
    }
    setValue(text);
    setAdLoading(true);

    const adShown = showInterstitialAd();
    if (!adShown) {
      finishGenerate();
    }
  };

  const handleSave = async () => {
    if (!qrGenerated) {
      Alert.alert("Error", "Please generate a QR code first");
      return;
    }

    try {
      const stored = await AsyncStorage.getItem("qr_history");
      const existing = stored ? JSON.parse(stored) : [];

      const newItem = {
        id: Date.now().toString(),
        text: value,
        timestamp: new Date().toLocaleTimeString(),
        date: new Date().toLocaleDateString(),
      };

      const updated = [newItem, ...existing];
      await AsyncStorage.setItem("qr_history", JSON.stringify(updated));
      Alert.alert("Success", "QR code saved to history!");
    } catch (error) {
      Alert.alert("Error", "Failed to save QR code");
    }
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(value);
    Alert.alert("Success", "QR code content copied to clipboard!");
  };

  const handleClear = () => {
    setText("");
    setValue("");
    setQrGenerated(false);
  };

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
  };

  return (
    <>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.bg }]}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>QR Code Generator</Text>
          <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
            Create QR codes from any text or URL
          </Text>
        </View>

        {/* INPUT SECTION */}
        <View
          style={[
            styles.section,
            {
              backgroundColor: colors.sectionBg,
              borderColor: colors.sectionBorder,
            },
          ]}
        >
          <View style={styles.labelContainer}>
            <Ionicons name="text" size={18} color="#00B366" />
            <Text style={[styles.label, { color: colors.text }]}>Enter Text or URL</Text>
          </View>

          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Type here..."
            placeholderTextColor={isDark ? "#666" : "#999"}
            autoCapitalize="none"
            autoCorrect={false}
            multiline
            maxLength={15000}
            style={[
              styles.input,
              {
                backgroundColor: colors.inputBg,
                color: colors.text,
                borderColor: colors.inputBorder,
              },
            ]}
          />

          {/* BUTTONS */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.generateButton]}
              onPress={handleGenerate}
            >
              <Ionicons name="qr-code" size={20} color="white" />
              <Text style={styles.buttonText}>Generate</Text>
            </TouchableOpacity>

            {qrGenerated && (
              <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
                <Ionicons name="save-outline" size={20} color="white" />
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            )}

            {qrGenerated && (
              <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={handleClear}>
                <Ionicons name="trash-outline" size={20} color="white" />
                <Text style={styles.buttonText}>Clear</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* QR CODE SECTION */}
        {qrGenerated && (
          <View
            style={[
              styles.section,
              {
                backgroundColor: colors.sectionBg,
                borderColor: colors.sectionBorder,
              },
            ]}
          >
            <View style={styles.labelContainer}>
              <Ionicons name="barcode" size={18} color="#00B366" />
              <Text style={[styles.label, { color: colors.text }]}>Your QR Code</Text>
            </View>

            <View style={styles.qrContainer}>
              <View
                style={[
                  styles.qrBox,
                  {
                    shadowColor: isDark ? "#00FF88" : "#000",
                  },
                ]}
              >
                <QRCode value={value} size={220} backgroundColor="white" color="black" />
              </View>

              {/* COPY BUTTON */}
              <TouchableOpacity style={styles.copyButton} onPress={handleCopy}>
                <Ionicons name="copy" size={18} color="black" />
                <Text style={styles.copyButtonText}>Copy Content</Text>
              </TouchableOpacity>
            </View>

            {/* VALUE DISPLAY */}
            <View
              style={[
                styles.valueBox,
                {
                  backgroundColor: colors.inputBg,
                  borderColor: colors.inputBorder,
                },
              ]}
            >
              <Text style={[styles.valueLabel, { color: colors.secondaryText }]}>Content:</Text>
              <Text style={[styles.valueText, { color: colors.text }]} numberOfLines={3}>
                {value}
              </Text>
            </View>

            {/* INFO */}
            <View
              style={[
                styles.infoBox,
                {
                  backgroundColor: colors.infoBg,
                  borderColor: colors.infoBorder,
                },
              ]}
            >
              <Ionicons name="information-circle" size={18} color="#00A3FF" />
              <Text style={styles.infoText}>
                Scan this QR code with any device to access the content
              </Text>
            </View>
          </View>
        )}

        {/* EMPTY STATE */}
        {!qrGenerated && (
          <View style={styles.emptyState}>
            <Ionicons name="qr-code-outline" size={64} color="#00FF88" style={{ opacity: 0.3 }} />
            <Text style={[styles.emptyStateText, { color: colors.secondaryText }]}>
              Generate a QR code to get started
            </Text>
          </View>
        )}
        {/* <BannerAdComponent /> */}
      </ScrollView>
      <AdLoadingOverlay visible={adLoading} isDark={isDark} testID="ad-overlay" />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },

  header: {
    marginBottom: 30,
    paddingTop: 10,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    fontWeight: "500",
  },

  section: {
    marginBottom: 28,
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
  },

  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    gap: 8,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
  },

  input: {
    width: "100%",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 15,
    minHeight: 60,
    textAlignVertical: "top",
    marginBottom: 8,
  },

  charCount: {
    textAlign: "right",
    fontSize: 12,
    marginBottom: 16,
    fontWeight: "500",
  },

  buttonContainer: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
  },

  button: {
    flex: 1,
    minWidth: "48%",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  generateButton: {
    backgroundColor: "#00B366",
  },

  saveButton: {
    backgroundColor: "#00A3FF",
  },

  clearButton: {
    backgroundColor: "#FF4444",
  },

  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 13,
  },

  qrContainer: {
    alignItems: "center",
    marginBottom: 20,
  },

  qrBox: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    marginBottom: 16,
  },

  copyButton: {
    backgroundColor: "#00B366",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  copyButtonText: {
    color: "black",
    fontWeight: "700",
    fontSize: 14,
  },

  valueBox: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 14,
  },

  valueLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
    textTransform: "uppercase",
  },

  valueText: {
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 20,
  },

  infoBox: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },

  infoText: {
    color: "#00A3FF",
    fontSize: 13,
    fontWeight: "500",
    flex: 1,
  },

  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },

  emptyStateText: {
    fontSize: 15,
    marginTop: 16,
    fontWeight: "500",
  },
});
