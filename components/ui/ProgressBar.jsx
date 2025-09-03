import { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";

const { width } = Dimensions.get("window");

export default function AnimatedProgressBar({ saved, total }) {
  const progress = useRef(new Animated.Value(0)).current;

  const percentage = Math.min(saved / total, 1); // cap at 100%

  useEffect(() => {
    const timeout = setTimeout(() => {
      Animated.timing(progress, {
        toValue: percentage * width * 0.9, // animate relative to screen width
        duration: 1500,
        useNativeDriver: false,
      }).start();
    }, 1000);

    return () => clearTimeout(timeout);
  }, [percentage]);

  return (
    <View style={styles.container}>
      {/* Track */}
      <View style={styles.track} />

      {/* Progress bar */}
      <Animated.View style={[styles.progress, { width: progress }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    width: "100%",
    alignItems: "center",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1D3F69",
  },
  amount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2A9D8F",
  },
  track: {
    height: 12,
    borderRadius: 8,
    backgroundColor: "#E5E7EB", // light gray track
    width: "90%",
    position: "absolute",
  },
  progress: {
    height: 12,
    borderRadius: 8,
    backgroundColor: "#3B82F6", // blue progress bar
    position: "absolute",
    left: 0,
  },
});
