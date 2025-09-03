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

export default function BudgetScreen() {
  const router = useRouter();

  // Dummy budget data
  const budgets = [
    { category: "Food", limit: 300, spent: 120 },
    { category: "Clothing", limit: 200, spent: 80 },
    { category: "Entertainment", limit: 150, spent: 60 },
    { category: "Transport", limit: 100, spent: 45 },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#1D3F69" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Budgets</Text>
      </View>

      {/* Scrollable budget list */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {budgets.map((budget, index) => {
          const remaining = budget.limit - budget.spent;
          return (
            <LinearGradient
              key={index}
              colors={["rgba(255,255,255,0.9)", "rgba(220,235,250,0.6)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.card}
            >
              <View style={styles.cardRow}>
                <Text style={styles.category}>{budget.category}</Text>
                <Text style={styles.limit}>${budget.limit}</Text>
              </View>
              <Text style={styles.spent}>Spent: ${budget.spent}</Text>
              <Text style={styles.remaining}>Remaining: ${remaining}</Text>
            </LinearGradient>
          );
        })}
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1D3F69",
  },
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
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  category: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1D3F69",
  },
  limit: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
  },
  spent: {
    fontSize: 14,
    color: "#E63946",
    marginBottom: 2,
  },
  remaining: {
    fontSize: 14,
    color: "#2A9D8F",
    fontWeight: "600",
  },
});
