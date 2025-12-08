import React, { useEffect, useState } from "react";
import {
  Alert,
  Animated,
  Easing,
  Linking,
  Platform,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";

import { useAppSettings } from "@/context/ThemeContext";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { Camera, CameraView, useCameraPermissions } from "expo-camera";
import * as Clipboard from "expo-clipboard";
import * as ImagePicker from "expo-image-picker";

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [data, setData] = useState<string | null>(null);
  const [flash, setFlash] = useState<"on" | "off">("off");
  const { autoFlash, autoOpenURL } = useAppSettings();

  const scheme = useColorScheme();
  const { isDark } = useAppTheme();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused){
      if (autoFlash && isDark) {
        setFlash("on");
      } else if (autoFlash && !isDark) {
        setFlash("off");
      }
      if(!autoFlash){
        setFlash("off");
      }
    }
  }, [scheme, autoFlash, isFocused]);

  useEffect(() => {
    return () => {
      setFlash("off");
      setScanned(false);
      setData(null);
    };
  }, []);

  // Auto-open URL if enabled
  const handleAutoOpenURL = (value: string) => {
    if (!autoOpenURL) return;

    const isURL =
      value.startsWith("http://") ||
      value.startsWith("https://") ||
      value.startsWith("www.") ||
      value.match(/\.[a-z]{2,}$/); // domain extensions (example: google.in)

    if (isURL) {
      const finalURL = value.startsWith("http") ? value : `https://${value}`;
      Linking.openURL(finalURL).catch(err => {
        console.log("URL open error:", err);
      });
    }
  };

  // Animation setup
  const animated = new Animated.Value(0);
  if (!scanned) {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animated, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(animated, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }

  // Copy to clipboard
  const copyToClipboard = async () => {
    if (!data) return;
    await Clipboard.setStringAsync(data);

    if (Platform.OS === "android") {
      ToastAndroid.show("Copied to clipboard!", ToastAndroid.SHORT);
    } else {
      Alert.alert("Copied", "QR code content copied!");
    }
  };

  const pickImageAndScan = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (result.canceled) return;

      const asset = result.assets[0];

      // Scan QR from selected image
      const scanResult = await Camera.scanFromURLAsync(asset.uri, ["qr"]);

      if (scanResult.length === 0) {
        Alert.alert("No QR Found", "This image does not contain a QR code.");
        return;
      }

      const qrValue = scanResult[0].data;

      setScanned(true);
      setData(qrValue);

      // Auto-open URL if enabled
      handleAutoOpenURL(qrValue);
    } catch (error) {
      console.log("Image scan error:", error);
      Alert.alert("Error", "Failed to process image.");
    }
  };


  if (!permission) {
    return (
      <Text style={[styles.text, { color: isDark ? "#fff" : "#000" }]}>
        Requesting permissions...
      </Text>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={[styles.text, { color: isDark ? "#fff" : "#000" }]}>
          Camera permission required
        </Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Allow Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Scan line animation
  const translateY = animated.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 250],
  });

  return (
    <View style={styles.container}>
      {/* CAMERA VIEW */}
      <CameraView
        enableTorch={flash === "on"}
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={
          scanned
            ? undefined
            : ({ data }) => {
                setScanned(true);
                setData(data);
                handleAutoOpenURL(data);
              }
        }
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
      />
      {/* SEMI-TRANSPARENT OVERLAY */}
      <View style={styles.overlayContainer}>
        {/* Top overlay */}
        <View style={styles.overlayTop} />

        {/* Middle section with scan box */}
        <View style={styles.middleSection}>
          {/* Left overlay */}
          <View style={styles.overlayLeft} />

          {/* SCAN BOX */}
          <View style={styles.scanBoxContainer}>
            <View style={styles.cornerTopLeft} />
            <View style={styles.cornerTopRight} />
            <View style={styles.cornerBottomLeft} />
            <View style={styles.cornerBottomRight} />

            <Animated.View
              style={[
                styles.scanLine,
                {
                  transform: [{ translateY }],
                },
              ]}
            />
          </View>

          {/* Right overlay */}
          <View style={styles.overlayRight} />
        </View>

        {/* Bottom overlay */}
        <View style={styles.overlayBottom}>
          {/* HEADER TEXT */}
          <Text style={styles.heading}>Position QR Code</Text>

          {/* RESULT BOX */}
          {data && (
            <View style={styles.resultBox}>
              <View style={styles.resultContent}>
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color="#00FF88"
                  style={{ marginRight: 10 }}
                />
                <Text style={styles.resultText} numberOfLines={2}>
                  {data}
                </Text>
              </View>

              <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
                <Ionicons name="copy" size={18} color="black" />
                <Text style={styles.copyButtonText}>Copy</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* SCAN AGAIN */}
          {scanned && (
            <TouchableOpacity
              style={styles.scanAgainButton}
              onPress={() => {
                setScanned(false);
                setData(null);
              }}
            >
              <Text style={styles.scanAgainButtonText}>Scan Again</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <TouchableOpacity
        onPress={pickImageAndScan}
        style={[styles.galleryButton, { backgroundColor: "rgba(0,0,0,0.4)" }]}
      >
        <Ionicons name="image-outline" size={24} color="#fff" />
      </TouchableOpacity>
      {/* FLASH BUTTON - TOP RIGHT */}
      <TouchableOpacity
        onPress={() => setFlash(flash === "off" ? "on" : "off")}
        style={[
          styles.flashButton,
          { backgroundColor: flash === "on" ? "rgba(0,255,136,0.3)" : "rgba(0,0,0,0.4)" },
        ]}
      >
        <Ionicons
          name={flash === "on" ? "flashlight" : "flashlight-outline"}
          size={24}
          color={flash === "on" ? "#00FF88" : "#fff"}
        />
      </TouchableOpacity>
    </View>
  );
}

// STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  overlayContainer: {
    flex: 1,
    flexDirection: "column",
  },

  overlayTop: {
    flex: 0.25,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },

  middleSection: {
    flex: 0.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  overlayLeft: {
    flex: 0.15,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },

  overlayRight: {
    flex: 0.15,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },

  scanBoxContainer: {
    width: 280,
    height: 280,
    borderWidth: 2,
    borderColor: "#00FF88",
    borderRadius: 24,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "rgba(0, 255, 136, 0.05)",
  },

  cornerTopLeft: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 40,
    height: 40,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: "#00FF88",
    borderTopLeftRadius: 20,
  },

  cornerTopRight: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 40,
    height: 40,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: "#00FF88",
    borderTopRightRadius: 20,
  },

  cornerBottomLeft: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 40,
    height: 40,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: "#00FF88",
    borderBottomLeftRadius: 20,
  },

  cornerBottomRight: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: "#00FF88",
    borderBottomRightRadius: 20,
  },

  scanLine: {
    width: "100%",
    height: 2,
    backgroundColor: "#00FF88",
    opacity: 0.8,
    shadowColor: "#00FF88",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },

  overlayBottom: {
    flex: 0.25,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    padding: 20,
    paddingTop: 30,
    alignItems: "center",
  },

  heading: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
  },

  resultBox: {
    width: "100%",
    backgroundColor: "rgba(0, 255, 136, 0.1)",
    borderColor: "#00FF88",
    borderWidth: 1,
    borderRadius: 12,
    padding: 6,
    marginBottom: 10,
  },

  resultContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  resultText: {
    flex: 1,
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },

  copyButton: {
    backgroundColor: "#00FF88",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  copyButtonText: {
    color: "#000",
    fontWeight: "700",
    fontSize: 14,
  },

  scanAgainButton: {
    backgroundColor: "#00A3FF",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },

  scanAgainButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },

  flashButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 100,
    padding: 12,
    borderRadius: 50,
  },
  galleryButton: {
    position: "absolute",
    top: 120,
    right: 20,
    padding: 10,
    borderRadius: 50,
    zIndex: 100,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  text: {
    marginBottom: 12,
    fontSize: 16,
  },

  button: {
    marginTop: 20,
    backgroundColor: "#00A3FF",
    padding: 12,
    borderRadius: 10,
    width: 160,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
});
