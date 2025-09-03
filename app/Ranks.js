import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function RankListScreen() {
  const router = useRouter();

  const ranks = [
    { name: "Alice", savings: 1200, rank: 1 },
    { name: "Bob", savings: 950, rank: 2 },
    { name: "Charlie", savings: 700, rank: 3 },
    { name: "David", savings: 500, rank: 4 },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#1D3F69" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rank List</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {ranks.map((r, index) => (
          <LinearGradient
            key={index}
            colors={["rgba(255,255,255,0.9)", "rgba(220,235,250,0.6)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.card}
          >
            <View style={styles.row}>
              <Text style={styles.rank}>#{r.rank}</Text>
              <Text style={styles.name}>{r.name}</Text>
              <Text style={styles.savings}>${r.savings}</Text>
            </View>
          </LinearGradient>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  backButton: { marginRight: 15, padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#1D3F69" },
  card: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#1D3F69",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 10,
    elevation: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rank: { fontSize: 16, fontWeight: "700", color: "#E63946", width: 40 },
  name: { fontSize: 16, fontWeight: "600", color: "#1D3F69", flex: 1 },
  savings: { fontSize: 14, fontWeight: "600", color: "#2A9D8F" },
});
