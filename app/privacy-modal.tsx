import { Stack, router } from "expo-router";
import { ScrollView, Text, TouchableOpacity } from "react-native";

export default function PrivacyModal() {
  return (
    <>
      {/* Modal header */}
      <Stack.Screen
        options={{
          title: "Privacy Policy",
          presentation: "modal",
        }}
      />

      <ScrollView style={{ flex: 1, padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>Privacy Policy</Text>

        <Text style={{ fontSize: 16, lineHeight: 22 }}>
          This app respects your privacy and does not collect or store any personal information. QR
          code scans happen only on your device, and no data is shared to servers.
        </Text>

        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginTop: 30, padding: 12, backgroundColor: "#007AFF", borderRadius: 10 }}
        >
          <Text style={{ color: "white", textAlign: "center", fontSize: 16 }}>Close</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}
