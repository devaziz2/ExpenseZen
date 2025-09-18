// NotificationsScreen.js
import { db } from "@/firebase";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import NotificationCard from "../components/sections/alters/NotificationCard";

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const loadNotifications = async () => {
      const storedUser = await AsyncStorage.getItem("userData");
      if (!storedUser) return;
      const parsedUser = JSON.parse(storedUser);
      setUserId(parsedUser.id);

      const userDoc = await getDoc(doc(db, "users", parsedUser.id));
      if (userDoc.exists()) {
        setNotifications(userDoc.data().notifications || []);
      }
    };
    loadNotifications();
  }, []);

  const markAllAsRead = async () => {
    if (!userId) return;
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    setNotifications(updated);

    await updateDoc(doc(db, "users", userId), {
      notifications: updated,
      isAlert: false,
    });
  };

  return (
    <View style={styles.container}>
      {/* Header with Mark All Read */}
      <View style={styles.header}>
        <View style={{ flexDirection: "row", gap: 2, alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={22} color="#1D3F69" />
          </TouchableOpacity>
          <Text style={styles.title}>Alerts</Text>
        </View>
        <TouchableOpacity style={styles.readAllBtn} onPress={markAllAsRead}>
          <Text style={styles.readAllText}>Mark all as read</Text>
        </TouchableOpacity>
      </View>

      {/* Notification List */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NotificationCard item={item} />}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1D3F69",
  },

  readAllBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#1D3F69",
    borderRadius: 10,
  },
  readAllText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
});
