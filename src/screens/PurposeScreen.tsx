import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Screen from "../components/Screen";
import { COLORS } from "../theme/colors";
import { SPACING } from "../theme/spacing";
import { RADIUS } from "../theme/radius";

const PurposeScreen = ({ navigation }: any) => {
  const [selected, setSelected] = useState<"PERSONAL" | "BUSINESS" | null>(null);

  const Card = ({ type }: { type: "PERSONAL" | "BUSINESS" }) => {
    const isActive = selected === type;

    return (
      <TouchableOpacity
        style={[
          styles.card,
          {
            borderColor: isActive ? COLORS.primary : COLORS.border,
            shadowColor: isActive ? COLORS.primary : "transparent",
          },
        ]}
        onPress={() => setSelected(type)}
        activeOpacity={0.8}
      >
        <Text style={styles.cardTitle}>{type}</Text>
        <Text style={styles.cardDesc}>
          {type === "PERSONAL"
            ? "Use your name & photo on quotes"
            : "Use your business logo & brand name"}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.title}>Choose Your Purpose</Text>
        <Text style={styles.subtitle}>How do you want to create your Suvichar?</Text>

        <Card type="PERSONAL" />
        <Card type="BUSINESS" />

        <TouchableOpacity
          style={[
            styles.button,
            { opacity: selected ? 1 : 0.5 },
          ]}
          disabled={!selected}
          onPress={() => navigation.navigate("ProfileSetup", { type: selected })}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
};

export default PurposeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.l,
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    color: COLORS.text,
    fontWeight: "700",
    marginBottom: SPACING.s,
  },
  subtitle: {
    color: COLORS.muted,
    marginBottom: SPACING.xl,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.l,
    padding: SPACING.l,
    borderWidth: 1,
    marginBottom: SPACING.m,
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 6,
  },
  cardTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "600",
    marginBottom: SPACING.s,
  },
  cardDesc: {
    color: COLORS.muted,
  },
  button: {
    marginTop: SPACING.xl,
    height: 56,
    borderRadius: RADIUS.l,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonText: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "600",
  },
});
