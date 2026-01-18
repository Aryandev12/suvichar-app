import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Alert } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import Screen from "../components/Screen";
import { COLORS } from "../theme/colors";
import { SPACING } from "../theme/spacing";
import { RADIUS } from "../theme/radius";
import firestore from "@react-native-firebase/firestore";
import { useAuthStore } from "../store/useAuthStore";



const CLOUD_NAME = "di32quaxl"; // from dashboard
const UPLOAD_PRESET = "Suvichar";     // your unsigned preset name


const ProfileSetupScreen = ({ route, navigation }: any) => {
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  console.log("USER:", user);




  const { type } = route.params; // PERSONAL or BUSINESS
  const [image, setImage] = useState<any>(null);
  const [name, setName] = useState("");

const pickImage = async () => {
  const result = await launchImageLibrary({
    mediaType: "photo",
    quality: 0.7,
  });

  if (result.assets && result.assets.length > 0) {
    setImage(result.assets[0].uri);
  }
};


const uploadToCloudinary = async (imageUri: string) => {
  const data = new FormData();

  data.append("file", {
    uri: imageUri,
    type: "image/jpeg",
    name: "profile.jpg",
  } as any);

  data.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: data,
    }
  );

  const json = await res.json();
  return json.secure_url;
};




 const onContinue = async () => {
  if (!image || !name || !user) return;

  try {
    // 1. Upload to Cloudinary
    const photoUrl = await uploadToCloudinary(image);

    // 2. Save to Firestore
    await firestore().collection("users").doc(user.uid).set(
  {
    phone: user.phone,
    name,
    purpose: type,
    photoUrl,
    isPremium: false,
    updatedAt: firestore.FieldValue.serverTimestamp(),
    createdAt: firestore.FieldValue.serverTimestamp(),
  },
  { merge: true }
);


    // 3. Save to Zustand (small URL, safe)
    updateUser({
      name,
      purpose: type,
      photoUrl,
    });

    // 4. Navigate
    navigation.reset({
      index: 0,
      routes: [{ name: "Main" }],
    });

  } catch (e) {
    console.log("CLOUDINARY ERROR:", e);
    Alert.alert("Upload failed", "Try again");
  }
};





  

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.title}>
          {type === "PERSONAL" ? "Set Your Profile" : "Set Your Business"}
        </Text>

        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />

          ) : (
            <Text style={styles.uploadText}>
              {type === "PERSONAL" ? "Upload Your Photo" : "Upload Logo"}
            </Text>
          )}
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder={type === "PERSONAL" ? "Enter Your Name" : "Enter Business Name"}
          placeholderTextColor={COLORS.muted}
          value={name}
          onChangeText={setName}
        />

        <TouchableOpacity
          style={[styles.button, { opacity: image && name ? 1 : 0.5 }]}
          disabled={ !name}
          onPress={onContinue}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
};

export default ProfileSetupScreen;

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
    marginBottom: SPACING.xl,
  },
  imagePicker: {
    height: 140,
    width: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.l,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 10,
  },
  uploadText: {
    color: COLORS.secondary,
    textAlign: "center",
  },
  image: {
    height: 136,
    width: 136,
    borderRadius: 68,
  },
  input: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.m,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.text,
    fontSize: 16,
    paddingHorizontal: SPACING.m,
    height: 56,
    marginBottom: SPACING.l,
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
