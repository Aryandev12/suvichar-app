import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import Screen from "../components/Screen";
import { COLORS } from "../theme/colors";
import { SPACING } from "../theme/spacing";
import { RADIUS } from "../theme/radius";
import { useAuthStore } from "../store/useAuthStore";

const UpgradePlanScreen = () => {
  const user = useAuthStore((s) => s.user);
  const showToast = () => {
    Alert.alert("Payment flow coming soon");
  };

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.title}>Go Premium ✨</Text>
        <Text style={styles.subtitle}>
          Unlock branding, contact details & more
        </Text>

        {/* Preview Card */}
        <View style={styles.previewCard}>
          <Text style={styles.previewName}>{user?.name || "John Doe"}</Text>
          <Text style={styles.previewTag}>Premium Suvichar Creator</Text>
        </View>

        {/* Plans */}
        <TouchableOpacity style={styles.planCard} onPress={showToast}>
          <Text style={styles.planTitle}>Monthly Plan</Text>
          <Text style={styles.price}>₹199 / month</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.planCard} onPress={showToast}>
          <Text style={styles.planTitle}>Yearly Plan</Text>
          <Text style={styles.price}>₹999 / year</Text>
          <Text style={styles.saveText}>Save more (₹83/month)</Text>
        </TouchableOpacity>

        {/* Free Version */}
        <View style={styles.freeBox}>
          <Text style={styles.freeTitle}>Free Version</Text>
          <Text style={styles.freeText}>• Watermark on quotes</Text>
          <Text style={styles.freeText}>• No contact details</Text>
          <Text style={styles.freeText}>• No business branding</Text>
        </View>
      </View>
    </Screen>
  );
};

export default UpgradePlanScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.l,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.s,
  },
  subtitle: {
    color: COLORS.muted,
    marginBottom: SPACING.l,
  },
  previewCard: {
    backgroundColor: COLORS.primary,
    padding: SPACING.l,
    borderRadius: RADIUS.l,
    alignItems: "center",
    marginBottom: SPACING.l,
  },
  previewName: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  previewTag: {
    color: "#fff",
    opacity: 0.8,
  },
  planCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.l,
    padding: SPACING.m,
    marginBottom: SPACING.m,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
  },
  price: {
    color: COLORS.primary,
    fontSize: 16,
    marginTop: 4,
  },
  saveText: {
    color: COLORS.secondary,
    marginTop: 2,
    fontSize: 12,
  },
  freeBox: {
    marginTop: SPACING.l,
    padding: SPACING.m,
    backgroundColor: COLORS.highlight,
    borderRadius: RADIUS.m,
  },
  freeTitle: {
    fontWeight: "700",
    marginBottom: SPACING.s,
  },
  freeText: {
    fontSize: 13,
  },
});
