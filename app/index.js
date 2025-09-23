import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

// Prevent native splash auto-hide until we finish JS animation
SplashScreen.preventAutoHideAsync();

export default function Splash() {
  const router = useRouter();

  // Animated values
  const translateY = useRef(new Animated.Value(-600)).current; // start much higher offscreen for larger logo
  const scale = useRef(new Animated.Value(0.6)).current; // start smaller to accommodate larger final size

  useEffect(() => {
    const runAnimation = async () => {
      await SplashScreen.hideAsync(); // hide native splash so JS splash shows

      // Initial 2-3 second delay before starting animation
      setTimeout(() => {
        Animated.sequence([
          // Initial drop from top with gravity-like effect
          Animated.timing(translateY, {
            toValue: 0,
            duration: 1000,
            easing: Easing.bezier(0.25, 0.46, 0.45, 0.94), // smoother easing
            useNativeDriver: true,
          }),

          // First bounce (smaller and smoother)
          Animated.timing(translateY, {
            toValue: -40,
            duration: 400,
            easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 0,
            duration: 400,
            easing: Easing.bezier(0.55, 0.06, 0.68, 0.19),
            useNativeDriver: true,
          }),

          // Second bounce (smaller)
          Animated.timing(translateY, {
            toValue: -20,
            duration: 300,
            easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 0,
            duration: 300,
            easing: Easing.bezier(0.55, 0.06, 0.68, 0.19),
            useNativeDriver: true,
          }),

          // Third bounce (very small)
          Animated.timing(translateY, {
            toValue: -8,
            duration: 250,
            easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 0,
            duration: 250,
            easing: Easing.bezier(0.55, 0.06, 0.68, 0.19),
            useNativeDriver: true,
          }),

          // Scale up to full size with smooth animation
          Animated.timing(scale, {
            toValue: 1,
            duration: 800,
            easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
            useNativeDriver: true,
          }),
        ]).start(() => {
          setTimeout(async () => {
            const storedUser = await AsyncStorage.getItem("userData");
            if (storedUser) {
              router.replace("/tabs/Home");
            } else {
              router.replace("/auth/Login");
            }
          }, 500);
        });
      }, 1200); // 1.2 second delay before animation starts
    };

    runAnimation();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require("../assets/images/splash.png")}
        style={[
          styles.logo,
          {
            transform: [{ translateY: translateY }, { scale: scale }],
          },
        ]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 200,
    height: 200,
  },
});
