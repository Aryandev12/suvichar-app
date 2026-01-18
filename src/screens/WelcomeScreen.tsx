import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from "react-native";
import Screen from "../components/Screen";
import { COLORS } from "../theme/colors";
import { SPACING } from "../theme/spacing";
import { RADIUS } from "../theme/radius";
import auth from '@react-native-firebase/auth';


const WelcomeScreen = ({ navigation }: any) => {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
  try {
    setLoading(true);
    const confirmation = await auth().signInWithPhoneNumber(`+91${phone}`);
    navigation.navigate("Otp", { confirmation });
  } catch (e) {
    Alert.alert("Failed to send OTP");
    console.log(e);
  } finally {
    setLoading(false);
  }
};



  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.title}>अपना सुविचार बनाएं</Text>
        <Text style={styles.subtitle}>अपनी पहचान के साथ कोट्स शेयर करें</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.countryCode}>+91</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter phone number"
            placeholderTextColor={COLORS.muted}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            maxLength={10}
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={sendOtp}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: SPACING.l,
  },
  title: {
    fontSize: 28,
    color: COLORS.text,
    fontWeight: "700",
    marginBottom: SPACING.s,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.muted,
    marginBottom: SPACING.xl,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.m,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.m,
    height: 56,
    marginBottom: SPACING.l,
  },
  countryCode: {
    color: COLORS.text,
    fontSize: 16,
    marginRight: SPACING.s,
  },
  input: {
    flex: 1,
    color: COLORS.text,
    fontSize: 16,
  },
  button: {
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
