import * as SplashScreen from "expo-splash-screen";
import { StyleSheet, Text, View } from "react-native";

// Prevent native splash auto-hide until we finish JS animation
SplashScreen.preventAutoHideAsync();

export default function Splash() {
  return (
    <View style={styles.container}>
      <Text>Splash Screen</Text>
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
