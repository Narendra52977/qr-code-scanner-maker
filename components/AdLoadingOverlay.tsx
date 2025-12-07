import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

interface AdLoadingOverlayProps {
  visible: boolean;
  isDark: boolean;
  testID?: string;
}

export const AdLoadingOverlay: React.FC<AdLoadingOverlayProps> = ({
  visible,
  isDark,
  testID = "ad-loading-overlay",
}) => {
  if (!visible) return null;

  return (
    <View
      testID={testID}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <View
        testID="ad-loading-container"
        style={{
          backgroundColor: isDark ? "#111827" : "#fff",
          paddingVertical: 20,
          paddingHorizontal: 40,
          borderRadius: 12,
          alignItems: "center",
        }}
      >
        <ActivityIndicator
          testID="ad-loading-spinner"
          color="#00B366"
          size="large"
          style={{ marginBottom: 12 }}
        />
        <Text
          testID="ad-loading-text"
          style={{
            color: isDark ? "#fff" : "#000",
            fontSize: 16,
            fontWeight: "600",
          }}
        >
          Loading Advertisement...
        </Text>
      </View>
    </View>
  );
};
