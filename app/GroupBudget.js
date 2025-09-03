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

export default function GroupBudgetScreen() {
  const router = useRouter();

  const groups = [
    { name: "Family Budget", members: 4, total: 2500 },
    { name: "Roommates Budget", members: 3, total: 1500 },
    { name: "Office Trip Fund", members: 6, total: 4000 },
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
        <Text style={styles.headerTitle}>Group Budgets</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {groups.map((g, index) => (
          <LinearGradient
            key={index}
            colors={["rgba(255,255,255,0.9)", "rgba(220,235,250,0.6)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.card}
          >
            <Text style={styles.category}>{g.name}</Text>
            <Text style={styles.limit}>Members: {g.members}</Text>
            <Text style={styles.remaining}>Total Budget: ${g.total}</Text>
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
    padding: 18,
    marginBottom: 16,
    shadowColor: "#1D3F69",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 10,
    elevation: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
  },
  category: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1D3F69",
    marginBottom: 6,
  },
  limit: { fontSize: 14, color: "#555" },
  remaining: { fontSize: 14, fontWeight: "600", color: "#2A9D8F" },
});
