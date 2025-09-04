import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";

const { width } = Dimensions.get("window");

export default function AnimatedProgressBar({ saved, total }) {
  const progress = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  const percentage = Math.min(saved / total, 1); // cap at 100%
  const percentageValue = percentage * 100;

  // Determine color based on percentage
  const getProgressColor = () => {
    if (percentageValue < 30) {
      return {
        gradient: ["#F87171", "#EF4444", "#DC2626"], // light → dark red
        glow: "#FCA5A5",
      };
    } else if (percentageValue >= 30 && percentageValue < 60) {
      return {
        gradient: ["#60A5FA", "#3B82F6", "#1D3F69"], // light → dark blue
        glow: "#93C5FD",
      };
    } else {
      return {
        gradient: ["#34D399", "#10B981", "#059669"], // light → dark green
        glow: "#6EE7B7",
      };
    }
  };

  const colors = getProgressColor();

  useEffect(() => {
    const timeout = setTimeout(() => {
      // Progress bar animation
      Animated.timing(progress, {
        toValue: percentage * width * 0.9,
        duration: 1500,
        useNativeDriver: false,
      }).start();

      // Glow animation for high progress
      if (percentageValue >= 60) {
        Animated.loop(
          Animated.sequence([
            Animated.timing(glowAnim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: false,
            }),
            Animated.timing(glowAnim, {
              toValue: 0,
              duration: 1000,
              useNativeDriver: false,
            }),
          ])
        ).start();
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [percentage, percentageValue]);

  return (
    <View style={styles.container}>
      {/* Track with subtle gradient */}
      <View style={styles.trackContainer}>
        <LinearGradient
          colors={["#F3F4F6", "#E5E7EB", "#D1D5DB"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.track}
        />
      </View>

      {/* Progress bar with gradient and glow */}
      <Animated.View
        style={[
          styles.progressContainer,
          {
            width: progress,
            shadowColor: colors.glow,
            shadowOpacity: glowAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.3, 0.8],
            }),
            shadowRadius: glowAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [4, 12],
            }),
          },
        ]}
      >
        <LinearGradient
          colors={colors.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.progress}
        />

        {/* Shimmer effect */}
        <Animated.View
          style={[
            styles.shimmer,
            {
              opacity: glowAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.2, 0.6],
              }),
            },
          ]}
        />
      </Animated.View>

      {/* Completion sparkle for 100% */}
      {percentageValue === 100 && (
        <Animated.View
          style={[
            styles.sparkle,
            {
              opacity: glowAnim,
              transform: [
                {
                  scale: glowAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1.2],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.sparkleInner} />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    width: "100%",
    position: "relative",
  },
  trackContainer: {
    width: "100%",
    position: "relative",
  },
  track: {
    height: 14,
    borderRadius: 10,
    width: "100%",
  },
  progressContainer: {
    position: "absolute",
    height: 14,
    borderRadius: 10,
    overflow: "hidden",
    elevation: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  progress: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  shimmer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    borderRadius: 10,
  },
  sparkle: {
    position: "absolute",
    right: "5%",
    top: -5,
    width: 24,
    height: 24,
  },
  // sparkleInner: {
  //   width: "100%",
  //   height: "100%",
  //   backgroundColor: "#FFD700",
  //   borderRadius: 12,
  //   shadowColor: "#FFD700",
  //   shadowOffset: {
  //     width: 0,
  //     height: 0,
  //   },
  //   shadowOpacity: 0.8,
  //   shadowRadius: 8,
  //   elevation: 8,
  // },
});
