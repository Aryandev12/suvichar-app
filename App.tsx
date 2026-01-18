import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "./src/screens/WelcomeScreen";
import OtpScreen from "./src/screens/OtpScreen";
import PurposeScreen from "./src/screens/PurposeScreen";
import ProfileSetupScreen from "./src/screens/ProfileSetupScreen";
import MainContentScreen from "./src/screens/MainContentScreen";
import EditDesignScreen from "./src/screens/EditDesignScreen";
import UpgradePlanScreen from "./src/screens/UpgradePlanScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import { auth } from "./src/services/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuthStore } from "./src/store/useAuthStore";




const Stack = createNativeStackNavigator();

export default function App() {
  const user = useAuthStore((s) => s.user);
const [loading, setLoading] = useState(true);
useEffect(() => {
  const unsub = auth().onAuthStateChanged((fbUser) => {
    setLoading(false);
  });
  return unsub;
}, []);

if (loading) return null;

const initialRoute = !user
  ? "Welcome"
  : user.name && user.purpose
  ? "Main"
  : "Purpose";

return (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Otp" component={OtpScreen} />
      <Stack.Screen name="Purpose" component={PurposeScreen} />
      <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
      <Stack.Screen name="Main" component={MainContentScreen} />
      <Stack.Screen name="EditDesign" component={EditDesignScreen} />
      <Stack.Screen name="Upgrade" component={UpgradePlanScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);








}
