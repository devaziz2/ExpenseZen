import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Home() {
  const [userData, setUserData] = useState({ token: null, name: null });

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const name = await AsyncStorage.getItem("fullName");
        setUserData({ token, name });
      } catch (error) {
        console.log("Error fetching data from storage:", error);
      }
    };

    loadData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home screen 🚀</Text>
      <Text style={styles.text}>Welcome, {userData.name || "Guest"} 👋</Text>
      <Text style={styles.smallText}>
        Token:{" "}
        {userData.token ? userData.token.slice(0, 20) + "..." : "No token"}
      </Text>
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
  text: { fontSize: 20, fontWeight: "600" },
});
