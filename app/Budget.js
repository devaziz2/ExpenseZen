import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import BudgetCard from "../components/sections/budget/BudgetCard";

export default function BudgetScreen() {
  const router = useRouter();
  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState("");
  const [budgets, setBudgets] = useState([]);

  const handleAddBudget = () => {
    if (!category.trim() || !limit) return;

    const newBudget = {
      id: Date.now(), // Simple ID generation
      category: category.trim(),
      limit: parseFloat(limit),
      spent: 0,
    };

    setBudgets([...budgets, newBudget]);
    setCategory("");
    setLimit("");
  };

  const handleEditBudget = (index, updatedBudget) => {
    const updatedBudgets = [...budgets];
    updatedBudgets[index] = { ...updatedBudgets[index], ...updatedBudget };
    setBudgets(updatedBudgets);
  };

  const handleDeleteBudget = (index) => {
    const updatedBudgets = budgets.filter((_, i) => i !== index);
    setBudgets(updatedBudgets);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={22} color="#1D3F69" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Budgets</Text>
        <View style={{ width: 30 }} />
      </View>

      {/* Input Section */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Category"
          placeholderTextColor="#9CA3AF"
          value={category}
          onChangeText={setCategory}
        />
        <TextInput
          style={styles.input}
          placeholder="Limit"
          placeholderTextColor="#9CA3AF"
          keyboardType="numeric"
          value={limit}
          onChangeText={setLimit}
        />
        <TouchableOpacity
          onPress={handleAddBudget}
          style={styles.addButton}
          activeOpacity={0.8}
        >
          <Text style={styles.addButtonText}>Add Budget</Text>
        </TouchableOpacity>
      </View>

      {/* Budget List */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {budgets.map((budget, index) => (
          <BudgetCard
            key={budget.id || index}
            category={budget.category}
            limit={budget.limit}
            spent={budget.spent}
            onEdit={(updatedBudget) => handleEditBudget(index, updatedBudget)}
            onDelete={() => handleDeleteBudget(index)}
          />
        ))}

        {budgets.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="wallet-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No Budgets Yet</Text>
            <Text style={styles.emptySubtitle}>
              Add your first budget to start tracking your expenses
            </Text>
          </View>
        )}
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
    justifyContent: "space-between",
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: "#E5E7EB",
    borderRadius: 999,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1D3F69",
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  input: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#D1D5DB",
    paddingVertical: 10,
    marginBottom: 16,
    fontSize: 16,
    color: "#1D3F69",
  },
  addButton: {
    backgroundColor: "#1D3F69",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  addButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6B7280",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
    paddingHorizontal: 40,
  },
});
