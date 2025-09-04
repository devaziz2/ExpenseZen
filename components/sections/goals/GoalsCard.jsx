import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SavingGoalCard({
  title,
  required,
  targetDate,
  totalSaved,
  onDelete,
}) {
  // Format date
  const dateObj = new Date(targetDate);
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // Win condition
  const today = new Date();
  const diffDays = Math.ceil((dateObj - today) / (1000 * 60 * 60 * 24));
  const isWin = diffDays <= 7 && totalSaved >= required;

  return (
    <LinearGradient
      colors={["rgba(255,255,255,0.95)", "rgba(220,235,250,0.7)"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      {/* Header */}
      <View style={styles.cardRow}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
          <Ionicons name="trash-outline" size={20} color="#E63946" />
        </TouchableOpacity>
      </View>

      {/* Required Money */}
      <Text style={styles.required}>Required: ${required}</Text>

      {/* Target Date */}
      <Text style={styles.date}>Target: {formattedDate}</Text>

      {/* Success Message */}
      {isWin && (
        <View style={styles.successRow}>
          <Ionicons name="trophy" size={20} color="#fff" />
          <Text style={styles.successText}>
            Congratulations! You achieved this goal 🎉
          </Text>
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
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
    alignItems: "center",
  },
  title: { fontSize: 16, fontWeight: "700", color: "#1D3F69" },
  deleteButton: { padding: 6 },
  required: {
    fontSize: 14,
    fontWeight: "600",
    color: "#E63946",
    marginBottom: 2,
  },
  date: { fontSize: 14, color: "#555", fontWeight: "500", marginBottom: 8 },
  successRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#10B981",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginTop: 6,
  },
  successText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
});
