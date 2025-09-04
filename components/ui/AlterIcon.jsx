import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, TouchableOpacity, View } from "react-native";

export default function AlertIcon({ isAlter }) {
  const router = useRouter();
  const animation = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  let intervalRef = useRef(null);

  useEffect(() => {
    if (isAlter) {
      // Start interval that triggers animation every 5 seconds
      intervalRef.current = setInterval(() => {
        triggerAnimation();
      }, 5000);

      // Trigger immediately once
      triggerAnimation();
    } else {
      clearInterval(intervalRef.current);
      animation.stopAnimation();
      animation.setValue(0);
      scaleAnim.setValue(1);
    }

    return () => clearInterval(intervalRef.current);
  }, [isAlter]);

  const triggerAnimation = () => {
    Animated.parallel([
      // Rotation vibration
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 70,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: -1,
          duration: 70,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 1,
          duration: 70,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 0,
          duration: 70,
          useNativeDriver: true,
        }),
      ]),

      // Scale pop
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  const rotate = animation.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ["-10deg", "0deg", "10deg"],
  });

  return (
    <TouchableOpacity onPress={() => router.push("/Alter")}>
      <Animated.View
        style={{
          transform: [{ rotate }, { scale: scaleAnim }],
          width: 20,
          height: 20,
        }}
      >
        <Ionicons name="notifications-outline" size={20} color="#1D3F69" />
        {isAlter && <View style={styles.dot} />}
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  dot: {
    position: "absolute",
    top: 0,
    right: 2,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "red",
  },
});
