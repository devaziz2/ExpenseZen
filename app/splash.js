import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function Splash() {
  const router = useRouter();

  useEffect(() => {
    const prepare = async () => {
      console.log("✅ Splash screen is working.....");
      await new Promise((resolve) => setTimeout(resolve, 3000));
      await SplashScreen.hideAsync();
      router.replace("/"); // Navigate to Home
    };

    prepare();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Loading ExpenseZen...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9FAFB",
  },
  text: {
    fontSize: 18,
    fontWeight: "500",
  },
});
