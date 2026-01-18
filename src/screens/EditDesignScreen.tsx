import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  Switch,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import Screen from "../components/Screen";
import { COLORS } from "../theme/colors";
import { SPACING } from "../theme/spacing";
import { RADIUS } from "../theme/radius";
import firestore from "@react-native-firebase/firestore";
import { useAuthStore } from "../store/useAuthStore";

const CLOUD_NAME = "di32quaxl";
const UPLOAD_PRESET = "Suvichar";


const EditDesignScreen = ({ navigation }: any) => {
 const user = useAuthStore((s) => s.user);
const updateUser = useAuthStore((s) => s.updateUser);

const [name, setName] = useState("");
const [photo, setPhoto] = useState<string | null>(null);
const [showDate, setShowDate] = useState(true);
const [loading, setLoading] = useState(true);
const [showPremiumModal, setShowPremiumModal] = useState(false);

useEffect(() => {
  if (!user?.uid) return;

  const unsub = firestore()
    .collection("users")
    .doc(user.uid)
    .onSnapshot((doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setName(data?.name || "");
        setPhoto(data?.photoUrl || null);
        setShowDate(data?.showDate ?? true);
        setLoading(false);
      }
    });

  return unsub;
}, [user?.uid]);


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




  const pickImage = async () => {
  const result = await launchImageLibrary({ mediaType: "photo" });
  if (result.assets && result.assets.length > 0) {
    const url = await uploadToCloudinary(result.assets[0].uri);
    setPhoto(url);
  }
};

const onSave = async () => {
  if (!user?.uid) return;

  await firestore().collection("users").doc(user.uid).set(
    {
      name,
      photoUrl: photo,
      showDate,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  updateUser({
    name,
    photoUrl: photo,
    showDate,
  });

  navigation.goBack();
};



  const LockedField = ({ label }: { label: string }) => (
    <TouchableOpacity
      style={styles.lockedField}
      onPress={() => setShowPremiumModal(true)}
    >
      <Text style={styles.lockedText}>{label}</Text>
      <Text style={styles.lockIcon}>🔒</Text>
    </TouchableOpacity>
  );

  return (
    <Screen>
      <View style={styles.container}>
        {/* Tabs */}
        <View style={styles.tabs}>
          <View style={[styles.tab, styles.activeTab]}>
            <Text style={styles.activeTabText}>PERSONAL</Text>
          </View>
          <View style={styles.tab}>
            <Text style={styles.tabText}>BUSINESS</Text>
          </View>
        </View>

        {/* Photo */}
        <TouchableOpacity style={styles.avatarWrapper} onPress={pickImage}>
          <Image source={{ uri: photo }} style={styles.avatar} />

          <Text style={styles.changePhoto}>Change Photo</Text>
        </TouchableOpacity>

        {/* Name */}
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Your Name"
          placeholderTextColor={COLORS.muted}
        />

        {/* Date Toggle */}
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Show Date on Quote</Text>
          <Switch
            value={showDate}
            onValueChange={setShowDate}
            thumbColor={COLORS.primary}
          />
        </View>

        {/* Locked Fields */}
        <LockedField label="About Yourself" />
        <LockedField label="Contact Details" />
        <LockedField label="Organization Details" />

        {/* Save Button */}
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={onSave}
          disabled={loading}
        >
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Premium Modal */}
      <Modal transparent visible={showPremiumModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Upgrade to Premium</Text>
            <Text style={styles.modalDesc}>
              Unlock advanced profile and branding features.
            </Text>

             <TouchableOpacity
  style={styles.modalBtn}
  onPress={() => {
    setShowPremiumModal(false);
    navigation.navigate("Upgrade");
  }}
>
  <Text style={styles.modalBtnText}>View Plans</Text>
</TouchableOpacity>


           

            <TouchableOpacity onPress={() => setShowPremiumModal(false)}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Screen>
  );
};

export default EditDesignScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.m,
  },
  tabs: {
    flexDirection: "row",
    marginBottom: SPACING.l,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.l,
    overflow: "hidden",
  },
  tab: {
    flex: 1,
    padding: SPACING.m,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    color: COLORS.text,
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "600",
  },
  avatarWrapper: {
    alignItems: "center",
    marginBottom: SPACING.l,
  },
  avatar: {
    height: 96,
    width: 96,
    borderRadius: 48,
    marginBottom: SPACING.s,
  },
  changePhoto: {
    color: COLORS.secondary,
  },
  input: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.m,
    padding: SPACING.m,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.text,
    marginBottom: SPACING.m,
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.m,
  },
  toggleLabel: {
    color: COLORS.text,
  },
  lockedField: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: COLORS.card,
    padding: SPACING.m,
    borderRadius: RADIUS.m,
    marginBottom: SPACING.s,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  lockedText: {
    color: COLORS.muted,
  },
  lockIcon: {
    fontSize: 16,
  },
  saveBtn: {
    marginTop: SPACING.l,
    backgroundColor: COLORS.primary,
    padding: SPACING.m,
    borderRadius: RADIUS.l,
    alignItems: "center",
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    backgroundColor: COLORS.card,
    padding: SPACING.l,
    borderRadius: RADIUS.l,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: SPACING.s,
    color: COLORS.text,
  },
  modalDesc: {
    color: COLORS.muted,
    textAlign: "center",
    marginBottom: SPACING.m,
  },
  modalBtn: {
    backgroundColor: COLORS.primary,
    padding: SPACING.s,
    borderRadius: RADIUS.m,
    width: "100%",
    alignItems: "center",
  },
  modalBtnText: {
    color: "#fff",
  },
  closeText: {
    marginTop: SPACING.s,
    color: COLORS.secondary,
  },
});
