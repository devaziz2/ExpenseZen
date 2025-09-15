import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BudgetingTools from "../../components/sections/Home/BudgetTools";
import AlertIcon from "../../components/ui/AlterIcon";
import AnimatedProgressBar from "../../components/ui/ProgressBar";

export default function Home() {
  const [user, setUser] = useState();

  useEffect(() => {
    const loadUserData = async () => {
      const storedUser = await AsyncStorage.getItem("userData");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setUser(user);
      }
    };
    loadUserData();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" backgroundColor="#1D3F69" />
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcome}>Welcome back,</Text>
            <Text style={styles.name}>{user?.fullName || "Guest"} 👋</Text>
          </View>
          {/* <Text style={styles.date}>{today}</Text> */}
          <AlertIcon isAlter={false} />
        </View>

        {/* Budget Card with Gradient Glass Effect */}
        <LinearGradient
          colors={["rgba(144,238,144,0.6)", "rgba(173,255,216,0.4)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          <View style={styles.overlay}>
            <Text style={styles.cardTitle}>Monthly Budget</Text>
            <Text style={styles.amount}>$1000.00</Text>

            <View style={styles.row}>
              <Text style={styles.label}>Spendings</Text>
              <Text style={styles.label}>Remaining</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.value}>$200.00</Text>
              <Text style={styles.value}>$800.00</Text>
            </View>
          </View>
        </LinearGradient>
        <View style={styles.animatedBar}>
          <View>
            <Text style={styles.heading}>Saving Streak</Text>
          </View>
          <Text style={styles.saving}>$450</Text>
        </View>
        <AnimatedProgressBar saved={800} total={1000} />
        <BudgetingTools />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
    marginRight: 5,
  },
  animatedBar: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    width: "100%",
  },
  heading: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1D3F69",
  },
  welcome: {
    fontSize: 16,
    color: "#555",
    fontFamily: Platform.OS === "ios" ? "Helvetica Neue" : "sans-serif-light",
  },
  name: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1D3F69",
  },
  date: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  saving: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1D3F69",
    marginRight: 10,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    overflow: "hidden",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.15)", // glass overlay
    borderRadius: 20,
    padding: 15,
  },
  cardTitle: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
    fontFamily: Platform.OS === "ios" ? "Helvetica Neue" : "sans-serif-light",
  },
  amount: {
    fontSize: 30,
    color: "#1D3F69",
    fontWeight: "300", // slim look
    fontFamily: Platform.OS === "ios" ? "Helvetica Neue" : "sans-serif-thin",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  label: {
    fontSize: 13,
    color: "#444",
    fontFamily: Platform.OS === "ios" ? "Helvetica Neue" : "sans-serif-light",
  },
  value: {
    fontSize: 18,
    color: "#1D3F69",
    fontWeight: "300", // slim look
    fontFamily: Platform.OS === "ios" ? "Helvetica Neue" : "sans-serif-thin",
  },
});
