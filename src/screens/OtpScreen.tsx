import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from "react-native";
import Screen from "../components/Screen";
import { COLORS } from "../theme/colors";
import { SPACING } from "../theme/spacing";
import { RADIUS } from "../theme/radius";
import { useRoute } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";
import { useAuthStore } from "../store/useAuthStore";



const OtpScreen = ({ navigation }: any) => {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);
  const setUser = useAuthStore((s) => s.setUser);


  const route = useRoute();
  const confirmation = route.params?.confirmation;



  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

const verifyOtp = async () => {
  try {
    if (!confirmation) return;

    const result = await confirmation.confirm(otp);
    const fbUser = result.user;

    const userRef = firestore().collection("users").doc(fbUser.uid);
    const snap = await userRef.get();

    if (!snap.exists) {
      // Brand new user
      await userRef.set({
        phone: fbUser.phoneNumber,
        isPremium: false,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      setUser({
        uid: fbUser.uid,
        phone: fbUser.phoneNumber || "",
        isPremium: false,
      });

      navigation.reset({
        index: 0,
        routes: [{ name: "Purpose" }],
      });
      return;
    }

    // User exists
    const data = snap.data();

    const isProfileComplete =
      data?.name &&
      data?.purpose &&
      data?.photoUrl;

    setUser({
      uid: fbUser.uid,
      phone: data?.phone || fbUser.phoneNumber || "",
      name: data?.name,
      photoUrl: data?.photoUrl,
      purpose: data?.purpose,
      isPremium: data?.isPremium,
    });

    if (!isProfileComplete) {
      // User logged in before but profile not finished
      navigation.reset({
        index: 0,
        routes: [{ name: "Purpose" }],
      });
    } else {
      // Fully onboarded user
      navigation.reset({
        index: 0,
        routes: [{ name: "Main" }],
      });
    }

  } catch (e) {
    console.log(e);
    Alert.alert("Invalid OTP");
  }
};



  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.title}>OTP Verification</Text>
        <Text style={styles.subtitle}>Enter the 6-digit code sent to your number</Text>

        <TextInput
          style={styles.otpInput}
          keyboardType="number-pad"
          maxLength={6}
          value={otp}
          onChangeText={setOtp}
          placeholder="------"
          placeholderTextColor={COLORS.muted}
        />

        <Text style={styles.timerText}>
          {timer > 0 ? `Resend OTP in ${timer}s` : "Didn't get code?"}
        </Text>

        {timer === 0 && (
          <TouchableOpacity onPress={() => setTimer(30)}>
            <Text style={styles.resend}>Resend OTP</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.button} onPress={verifyOtp}>
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
};

export default OtpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: SPACING.l,
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
  otpInput: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.m,
    borderWidth: 1,
    borderColor: COLORS.primary,
    color: COLORS.text,
    fontSize: 24,
    letterSpacing: 10,
    textAlign: "center",
    paddingVertical: SPACING.m,
    marginBottom: SPACING.l,
  },
  timerText: {
    color: COLORS.muted,
    textAlign: "center",
  },
  resend: {
    color: COLORS.secondary,
    textAlign: "center",
    marginTop: SPACING.s,
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
