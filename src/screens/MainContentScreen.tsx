import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
} from "react-native";
import Screen from "../components/Screen";
import { COLORS } from "../theme/colors";
import { SPACING } from "../theme/spacing";
import { RADIUS } from "../theme/radius";
import { SafeAreaView } from "react-native-safe-area-context";
import ViewShot from "react-native-view-shot";
import Share from "react-native-share";
import { useRef } from "react";
import { Animated } from "react-native";
import { useEffect,} from "react";
import { launchImageLibrary } from "react-native-image-picker";
import firestore from "@react-native-firebase/firestore";
import { useAuthStore } from "../store/useAuthStore";
import { useFocusEffect } from "@react-navigation/native";


 

const CLOUD_NAME = "di32quaxl";
const UPLOAD_PRESET = "Suvichar";
const categories = ["Templates", "Upload Image","Good Morning", "Motivational", "Shayari", "Religious", "Love", "Festival"];

const quotes = [
  {
    id: 1,
    text: "आज का दिन नई उम्मीदों से भरा हो।",
    image: require("../assets/quotes/quote1.jpg"),
  },
  {
    id: 2,
    text: "मेहनत कभी धोखा नहीं देती।",
    image: require("../assets/quotes/quote2.jpg"),
  },
  {
    id: 3,
    text: "विश्वास ही सबसे बड़ी ताकत है।",
    image: require("../assets/quotes/quote3.jpg"),
  },
];

const MainContentScreen = ({ navigation }: any) => {
  const [index, setIndex] = useState(0);
  const quote = quotes[index];

  const viewShotRef = useRef<any>(null);

  const glowAnim = useRef(new Animated.Value(0)).current;

  const [customBg, setCustomBg] = useState<string | null>(null);

  const [quoteText, setQuoteText] = useState(quotes[0].text);
  const [showEditor, setShowEditor] = useState(false);
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = firestore()
      .collection("users")
      .doc(user.uid)
      .onSnapshot((doc) => {
        if (doc.exists()) {
          const data = doc.data();
          updateUser({
            name: data?.name,
            photoUrl: data?.photoUrl,
            purpose: data?.purpose,
            isPremium: data?.isPremium,
          });
        }
      });

    return () => unsubscribe();
    
  }, [user?.uid]);


const uploadToCloudinary = async (imageUri: string) => {
  const data = new FormData();

  data.append("file", {
    uri: imageUri,
    type: "image/jpeg",
    name: "quote.jpg",
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


const saveQuoteToFirestore = async (imageUrl: string, action: "share" | "download") => {
  if (!user?.uid) return;

  await firestore()
    .collection("users")
    .doc(user.uid)
    .collection("quotes")
    .add({
      text: quoteText,
      imageUrl,
      category: categories[index] || "Template",
      action, // share or download
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
};











useEffect(() => {
  Animated.loop(
    Animated.sequence([
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(glowAnim, {
        toValue: 0,
        duration: 1500,
        useNativeDriver: true,
      }),
    ])
  ).start();
}, []);



  const nextQuote = () => {
  const nextIndex = (index + 1) % quotes.length;
  setIndex(nextIndex);
  setQuoteText(quotes[nextIndex].text);
};

 const onShare = async () => {
  try {
    const localUri = await viewShotRef.current.capture();

    const cloudUrl = await uploadToCloudinary(localUri);

    await saveQuoteToFirestore(cloudUrl, "share");

    await Share.open({ url: localUri });
  } catch (e) {
    console.log("Share error:", e);
  }
};

const onDownload = async () => {
  try {
    const localUri = await viewShotRef.current.capture();

    const cloudUrl = await uploadToCloudinary(localUri);

    await saveQuoteToFirestore(cloudUrl, "download");

    await Share.open({
      url: localUri,
      saveToFiles: true,
    });
  } catch (e) {
    console.log("Download error:", e);
  }
};


const onPickBackground = async () => {
  const result = await launchImageLibrary({ mediaType: "photo" });
  if (result.assets && result.assets.length > 0) {
    setCustomBg(result.assets[0].uri);
  }
};




  return (
    <Screen>
     
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appName}>Suvichar</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
  {user?.photoUrl ? (
    <Image
      source={{ uri: user.photoUrl }}
      style={styles.profileAvatar}
    />
  ) : (
    <View style={styles.profilePlaceholder} />
  )}
</TouchableOpacity>

        
        </View>

        {/* Categories */}
       <ScrollView 
  horizontal 
  showsHorizontalScrollIndicator={false} 
  style={styles.pills}
  contentContainerStyle={styles.pillsContent}
>
  {categories.map((cat) => (
    <TouchableOpacity
      key={cat}
      style={styles.pill}
      onPress={() => {
        if (cat === "Upload Image") onPickBackground();
      }}
    >
      <Text style={styles.pillText}>{cat}</Text>
    </TouchableOpacity>
  ))}
</ScrollView>


        {/* Quote Card */}
        <ViewShot ref={viewShotRef} options={{ format: "jpg", quality: 0.95 }}>
        <View style={styles.cardWrapper}>
          <ImageBackground
  source={customBg ? { uri: customBg } : quote.image}
  style={styles.card}
  imageStyle={styles.cardImage}
>

            <View style={styles.dateBadge}>
              <Text style={styles.dateText}>17 जनवरी</Text>
            </View>

            <Text style={styles.quoteText}>{quoteText}</Text>


            <View style={styles.userRow}>
              <Animated.View
  style={[
    styles.avatarGlow,
    {
      transform: [
        {
          scale: glowAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1.15],
          }),
        },
      ],
      opacity: glowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.6, 1],
      }),
    },
  ]}
>
  <Image source={{ uri: user?.photoUrl || "https://i.pravatar.cc/150" }} style={styles.avatar} />
</Animated.View>

              <Text style={styles.userName}>{user?.name || "Your Name"}</Text>
            </View>
          </ImageBackground>
        </View>
        </ViewShot>

        {/* Next Button */}
        <TouchableOpacity style={styles.nextBtn} onPress={nextQuote}>
          <Text style={styles.nextText}>Next Quote</Text>
        </TouchableOpacity>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionBtn} onPress={onShare}><Text>Share</Text></TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={onDownload}><Text>Download</Text></TouchableOpacity>
          <TouchableOpacity
  style={styles.actionBtn}
  onPress={() => navigation.navigate("EditDesign")}
>
  <Text>Edit</Text>
</TouchableOpacity>
  <TouchableOpacity onPress={() => setShowEditor(true)}>
    <Text>Edit Quote</Text>
  </TouchableOpacity>

        
        </View>
      </View>

    
    <Modal visible={showEditor} transparent animationType="slide">
  <View style={styles.modalOverlay}>
    <View style={styles.modalBox}>
      <Text style={styles.modalTitle}>Edit Your Quote</Text>

      <TextInput
        value={quoteText}
        onChangeText={setQuoteText}
        multiline
        style={styles.textArea}
        placeholder="Type your quote here..."
        placeholderTextColor={COLORS.muted}
      />

      <TouchableOpacity
        style={styles.saveBtn}
        onPress={() => setShowEditor(false)}
      >
        <Text style={{ color: "#fff" }}>Done</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

    </Screen>
  );
};

export default MainContentScreen;

const styles = StyleSheet.create({
 container: {
  flex: 1,
  paddingTop: SPACING.m,
  paddingBottom: SPACING.m,
},
modalOverlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.4)",
  justifyContent: "center",
  alignItems: "center",
},
modalBox: {
  backgroundColor: COLORS.card,
  padding: SPACING.l,
  borderRadius: RADIUS.l,
  width: "90%",
},
modalTitle: {
  fontSize: 18,
  fontWeight: "700",
  marginBottom: SPACING.s,
  color: COLORS.text,
},
textArea: {
  minHeight: 100,
  borderWidth: 1,
  borderColor: COLORS.border,
  borderRadius: RADIUS.m,
  padding: SPACING.s,
  color: COLORS.text,
  marginBottom: SPACING.m,
},
saveBtn: {
  backgroundColor: COLORS.primary,
  padding: SPACING.s,
  borderRadius: RADIUS.m,
  alignItems: "center",
},


  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
    marginBottom: SPACING.s,
  },
  appName: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
  },
  profileIcon: {
    height: 36,
    width: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
  },
  pills: {
    maxHeight: 50,
    marginBottom: SPACING.m,
  },
  pillsContent: {
    paddingHorizontal: SPACING.m,
  },
  pill: {
    backgroundColor: COLORS.card,
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
    borderRadius: 20,
    marginRight: SPACING.s,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  pillText: {
    color: COLORS.text,
  },
  cardWrapper: {
    alignItems: "center",
    marginVertical: SPACING.m,
    marginLeft: SPACING.m,
  },
  card: {
    height: 380,
    width: "100%",
    borderRadius: RADIUS.l,
    overflow: "hidden",
    padding: SPACING.m,
    marginLeft : SPACING.m,
    justifyContent: "space-between",
  },
  cardImage: {
    borderRadius: RADIUS.l,
  },
  dateBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.s,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  dateText: {
    color: "#fff",
    fontSize: 12,
  },
  quoteText: {
    color: "#fff",
    fontSize: 22,
    textAlign: "center",
    fontWeight: "600",
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  
  avatar: {
    height: 56,
    width: 56,
    borderRadius: 28,
  },
  userName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  nextBtn: {
    marginHorizontal: SPACING.m,
    backgroundColor: COLORS.primary,
    padding: SPACING.m,
    borderRadius: RADIUS.l,
    alignItems: "center",
    marginVertical: SPACING.s,
  },
  nextText: {
    color: "#fff",
    fontSize: 16,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: SPACING.m,
    marginTop: SPACING.s,
  },
  actionBtn: {
    padding: SPACING.s,
  },
  avatarGlow: {
  height: 64,
  width: 64,
  borderRadius: 32,
  backgroundColor: COLORS.secondary,
  justifyContent: "center",
  alignItems: "center",
  marginRight: SPACING.s,
  shadowColor: COLORS.secondary,
  shadowOpacity: 0.9,
  shadowRadius: 12,
  elevation: 12,
},
profileAvatar: {
  height: 36,
  width: 36,
  borderRadius: 18,
  borderWidth: 2,
  borderColor: COLORS.primary,
},
profilePlaceholder: {
  height: 36,
  width: 36,
  borderRadius: 18,
  backgroundColor: COLORS.primary,
},


});