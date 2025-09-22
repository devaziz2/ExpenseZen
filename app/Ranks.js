import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../firebase";

export default function RankListScreen() {
  const router = useRouter();

  const [users, setUsers] = useState([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  // 🔹 Load users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnap = await getDocs(collection(db, "users"));
        let data = [];
        querySnap.forEach((doc) => {
          data.push({
            id: doc.id,
            name: doc.data().fullName || "Anonymous",
            goalsMet: doc.data().goalsComplete || 0,
          });
        });

        // sort by goalsMet (high → low)
        data.sort((a, b) => b.goalsMet - a.goalsMet);

        setUsers(data);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
      }
    };

    fetchUsers();
  }, []);

  // 🔹 Animations
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Top 3 for podium
  const podium = users.slice(0, 3);
  const rest = users.slice(3);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={22} color="#1D3F69" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Leaderboard</Text>
        <View style={{ width: 30 }} />
      </View>

      {/* Podium */}
      <Animated.View
        style={[
          styles.podiumContainer,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        {/* Second */}
        <LinearGradient
          colors={["#CBD5E1", "#94A3B8"]}
          style={[styles.podiumCard, { height: 160 }]}
        >
          <Text style={styles.rankText}>🥈</Text>
          <Text style={styles.nameText}>{podium[1]?.name}</Text>
          <Text style={styles.goalText}>{podium[1]?.goalsMet} Goals</Text>
        </LinearGradient>

        {/* First */}
        <LinearGradient
          colors={["#FACC15", "#FDE68A"]}
          style={[styles.podiumCard, { height: 200 }]}
        >
          <Text style={styles.rankText}>🥇</Text>
          <Text style={styles.nameText}>{podium[0]?.name}</Text>
          <Text style={styles.goalText}>{podium[0]?.goalsMet} Goals</Text>
        </LinearGradient>

        {/* Third */}
        <LinearGradient
          colors={["#FB923C", "#FDBA74"]}
          style={[styles.podiumCard, { height: 140 }]}
        >
          <Text style={styles.rankText}>🥉</Text>
          <Text style={styles.nameText}>{podium[2]?.name}</Text>
          <Text style={styles.goalText}>{podium[2]?.goalsMet} Goals</Text>
        </LinearGradient>
      </Animated.View>

      {/* Rest of leaderboard */}
      <FlatList
        data={rest}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            }}
          >
            <LinearGradient
              colors={["#3B82F6", "#60A5FA"]}
              style={styles.listCard}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialCommunityIcons
                  name="medal-outline"
                  size={22}
                  color="white"
                />
                <Text style={styles.listRank}>{index + 4}</Text>
                <Text style={styles.listName}>{item.name}</Text>
              </View>
              <Text style={styles.listGoals}>{item.goalsMet} Goals</Text>
            </LinearGradient>
          </Animated.View>
        )}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB", paddingTop: 50 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: "#E5E7EB",
    borderRadius: 999,
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1D3F69",
  },

  // Podium
  podiumContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  podiumCard: {
    flex: 1,
    marginHorizontal: 6,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  rankText: { fontSize: 28, fontWeight: "700", marginBottom: 4 },
  nameText: { fontSize: 16, fontWeight: "600", color: "#1E293B" },
  goalText: { fontSize: 14, color: "#334155", marginTop: 2 },

  // List
  listCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    marginVertical: 6,
    padding: 16,
    borderRadius: 14,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  listRank: { fontSize: 16, fontWeight: "700", marginLeft: 6, color: "white" },
  listName: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
    color: "white",
  },
  listGoals: { fontSize: 14, color: "white", fontWeight: "500" },
});
