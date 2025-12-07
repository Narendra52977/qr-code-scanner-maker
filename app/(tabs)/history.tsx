import { useAppTheme } from "@/hooks/useAppTheme";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import * as Clipboard from "expo-clipboard";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import QRCode from "react-native-qrcode-svg";

interface QRItem {
  id: string;
  text: string;
  timestamp: string;
  date: string;
}

export default function History() {
  const [history, setHistory] = useState<QRItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [theme, setTheme] = useState<"auto" | "light" | "dark">("auto");

  const systemScheme = useColorScheme();
   const { isDark } = useAppTheme();

  // Load theme setting
  useEffect(() => {
    (async () => {
      const savedTheme = await AsyncStorage.getItem("theme");
      if (savedTheme) setTheme(savedTheme as any);
    })();
  }, []);

  // Load history when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  const loadHistory = async () => {
    try {
      setLoading(true);
      const stored = await AsyncStorage.getItem("qr_history");
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id: string) => {
    Alert.alert("Delete", "Are you sure you want to delete this item?", [
      { text: "Cancel", onPress: () => {} },
      {
        text: "Delete",
        onPress: async () => {
          try {
            const updated = history.filter(item => item.id !== id);
            setHistory(updated);
            await AsyncStorage.setItem("qr_history", JSON.stringify(updated));
            Alert.alert("Success", "Item deleted");
          } catch (error) {
            Alert.alert("Error", "Failed to delete item");
          }
        },
        style: "destructive",
      },
    ]);
  };

  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
    Alert.alert("Copied", "Content copied to clipboard!");
  };

  const clearHistory = async () => {
    Alert.alert("Clear History", "Delete all items?", [
      { text: "Cancel", onPress: () => {} },
      {
        text: "Clear All",
        onPress: async () => {
          try {
            setHistory([]);
            await AsyncStorage.setItem("qr_history", JSON.stringify([]));
            Alert.alert("Success", "History cleared");
          } catch (error) {
            Alert.alert("Error", "Failed to clear history");
          }
        },
        style: "destructive",
      },
    ]);
  };

  // Color scheme based on theme
  const colors = {
    bg: isDark ? "#080B16" : "#f4f4f4",
    text: isDark ? "#fff" : "#000",
    secondaryText: isDark ? "#999" : "#666",
    cardBg: isDark ? "rgba(0, 255, 136, 0.05)" : "rgba(0, 255, 136, 0.08)",
    cardBorder: isDark ? "rgba(0, 255, 136, 0.2)" : "rgba(0, 255, 136, 0.3)",
    inputBg: isDark ? "#111827" : "#fff",
    inputBorder: isDark ? "#1F2937" : "#e0e0e0",
    chevronColor: isDark ? "#666" : "#999",
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        <ActivityIndicator size="large" color="#00B366" />
      </View>
    );
  }

  if (history.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        <View style={styles.emptyState}>
          <Ionicons name="time-outline" size={64} color="#00FF88" style={{ opacity: 0.3 }} />
          <Text style={[styles.emptyStateText, { color: colors.text }]}>No QR codes yet</Text>
          <Text style={[styles.emptyStateSubtext, { color: colors.secondaryText }]}>
            Generate and save QR codes to see them here
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>History</Text>
          <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
            {history.length} saved QR codes
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.clearButton,
            { backgroundColor: isDark ? "rgba(255, 68, 68, 0.2)" : "rgba(255, 68, 68, 0.15)" },
          ]}
          onPress={clearHistory}
        >
          <Ionicons name="trash-outline" size={20} color="#FF4444" />
        </TouchableOpacity>
      </View>

      {/* LIST */}
      <FlatList
        data={history}
        keyExtractor={item => item.id}
        scrollEnabled={true}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.cardBg,
                borderColor: colors.cardBorder,
              },
            ]}
          >
            {/* HEADER */}
            <TouchableOpacity
              style={styles.cardHeader}
              onPress={() => setExpandedId(expandedId === item.id ? null : item.id)}
            >
              <View style={styles.cardTitle}>
                <Ionicons name="qr-code" size={20} color="#00B366" />
                <View style={styles.titleText}>
                  <Text style={[styles.cardTextMain, { color: colors.text }]} numberOfLines={2}>
                    {item.text}
                  </Text>
                  <Text style={[styles.cardDate, { color: colors.secondaryText }]}>
                    {item.date}
                  </Text>
                </View>
              </View>
              <Ionicons
                name={expandedId === item.id ? "chevron-up" : "chevron-down"}
                size={24}
                color={colors.chevronColor}
              />
            </TouchableOpacity>

            {/* EXPANDED CONTENT */}
            {expandedId === item.id && (
              <View
                style={[
                  styles.cardExpanded,
                  {
                    borderTopColor: colors.cardBorder,
                  },
                ]}
              >
                {/* QR CODE */}
                <View style={styles.qrDisplayBox}>
                  <QRCode value={item.text} size={160} backgroundColor="white" color="black" />
                </View>

                {/* FULL TEXT */}
                <View
                  style={[
                    styles.fullTextBox,
                    {
                      backgroundColor: colors.inputBg,
                      borderColor: colors.inputBorder,
                    },
                  ]}
                >
                  <Text style={[styles.fullTextLabel, { color: colors.secondaryText }]}>
                    Full Content:
                  </Text>
                  <Text style={[styles.fullText, { color: colors.text }]}>{item.text}</Text>
                </View>

                {/* BUTTONS */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.copyBtn]}
                    onPress={() => copyToClipboard(item.text)}
                  >
                    <Ionicons name="copy" size={16} color="black" />
                    <Text style={styles.copyBtnText}>Copy</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteBtn]}
                    onPress={() => deleteItem(item.id)}
                  >
                    <Ionicons name="trash-outline" size={16} color="white" />
                    <Text style={styles.deleteBtnText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingTop: 8,
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 13,
    fontWeight: "500",
  },

  clearButton: {
    padding: 10,
    borderRadius: 10,
  },

  listContent: {
    paddingBottom: 20,
  },

  card: {
    borderWidth: 1,
    borderRadius: 14,
    marginBottom: 14,
    overflow: "hidden",
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 14,
  },

  cardTitle: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 10,
  },

  titleText: {
    flex: 1,
  },

  cardTextMain: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },

  cardDate: {
    fontSize: 12,
    fontWeight: "500",
  },

  cardExpanded: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    borderTopWidth: 1,
  },

  qrDisplayBox: {
    backgroundColor: "white",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 14,
  },

  fullTextBox: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 14,
    borderWidth: 1,
  },

  fullTextLabel: {
    fontSize: 11,
    fontWeight: "600",
    marginBottom: 6,
    textTransform: "uppercase",
  },

  fullText: {
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 20,
  },

  actionButtons: {
    flexDirection: "row",
    gap: 10,
  },

  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  copyBtn: {
    backgroundColor: "#00B366",
  },

  copyBtnText: {
    color: "black",
    fontWeight: "700",
    fontSize: 13,
  },

  deleteBtn: {
    backgroundColor: "#FF4444",
  },

  deleteBtnText: {
    color: "white",
    fontWeight: "700",
    fontSize: 13,
  },

  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyStateText: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 16,
  },

  emptyStateSubtext: {
    fontSize: 13,
    marginTop: 6,
    fontWeight: "500",
  },
});
