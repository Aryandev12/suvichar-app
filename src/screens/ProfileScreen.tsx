import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from "react-native";
import Screen from "../components/Screen";
import { COLORS } from "../theme/colors";
import { SPACING } from "../theme/spacing";
import { RADIUS } from "../theme/radius";

import firestore from "@react-native-firebase/firestore";
import { useAuthStore } from "../store/useAuthStore";
import { useEffect, useState } from "react";
import auth from "@react-native-firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";





const ProfileScreen = ({ navigation }: any) => {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
const [downloads, setDownloads] = useState<any[]>([]);



useEffect(() => {
  if (!user?.uid) return;

  const unsubscribe = firestore()
    .collection("users")
    .doc(user.uid)
    .collection("quotes")
    .orderBy("createdAt", "desc")
    .onSnapshot((snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDownloads(list);
    });

  return unsubscribe;
}, [user?.uid]);


const handleSignOut = async () => {
  try {
    await auth().signOut();        // Firebase logout
    await AsyncStorage.clear();   // Clear persisted state
    logout();                     // Clear Zustand memory

    navigation.reset({
      index: 0,
      routes: [{ name: "Welcome" }],
    });
  } catch (e) {
    console.log("Logout error:", e);
  }
};



  return (
    <Screen>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
  {user?.photoUrl ? (
    <Image source={{ uri: user.photoUrl }} style={styles.avatar} />
  ) : (
    <View style={[styles.avatar, { backgroundColor: COLORS.card }]} />
  )}

  <Text style={styles.name}>{user?.name || "Your Name"}</Text>
  <Text style={styles.phone}>{user?.phone || ""}</Text>

  <TouchableOpacity
    style={styles.editBtn}
    onPress={() => navigation.navigate("EditDesign")}
  >
    <Text style={styles.editText}>EDIT PROFILE</Text>
  </TouchableOpacity>

  <TouchableOpacity
  style={[styles.editBtn, { marginTop: SPACING.s, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.primary }]}
  onPress={handleSignOut}
>
  <Text style={[styles.editText, { color: COLORS.primary }]}>SIGN OUT</Text>
</TouchableOpacity>

</View>
   <Text style={styles.sectionTitle}>Downloaded Quotes</Text>

{downloads.length === 0 ? (
  <View style={styles.emptyBox}>
    <Text style={styles.emptyText}>No downloads yet</Text>
  </View>
) : (
  <FlatList
    data={downloads}
    numColumns={3}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => (
      <Image source={{ uri: item.imageUrl }} style={styles.gridImage} />
    )}
  />
)}



       
      </View>
    </Screen>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.l,
  },
  header: {
    alignItems: "center",
    marginBottom: SPACING.l,
  },
  avatar: {
    height: 100,
    width: 100,
    borderRadius: 50,
    marginBottom: SPACING.s,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
  },
  phone: {
    color: COLORS.muted,
    marginBottom: SPACING.m,
  },
  editBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.l,
    paddingVertical: SPACING.s,
    borderRadius: RADIUS.l,
  },
  editText: {
    color: "#fff",
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.s,
  },
  emptyBox: {
    height: 150,
    borderRadius: RADIUS.m,
    backgroundColor: COLORS.card,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emptyText: {
    color: COLORS.muted,
  },
  gridImage: {
    height: 100,
    width: 100,
    margin: SPACING.s,
    borderRadius: RADIUS.s,
  },
});
