import { db } from "@/firebase";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
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
  const [userId, setUserId] = useState(null);

  // ✅ Load budgets from Firestore
  useEffect(() => {
    const loadUserBudgets = async () => {
      const storedUser = await AsyncStorage.getItem("userData");
      if (!storedUser) return;

      const parsedUser = JSON.parse(storedUser);
      const uid = parsedUser.id;
      setUserId(uid);

      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        setBudgets(userDoc.data().budgets || []);
      }
    };

    loadUserBudgets();
  }, []);

  // ✅ Add Budget
  const handleAddBudget = async () => {
    if (!category.trim() || !limit || !userId) return;

    const newBudget = {
      id: Date.now(),
      category: category.trim(),
      limit: parseFloat(limit),
      spent: 0,
    };

    // Update Firestore
    const updateData = await updateDoc(doc(db, "users", userId), {
      budgets: arrayUnion(newBudget),
    });

    console.log("update data");
    console.log(updateData);

    console.log("new budget added");

    setBudgets((prev) => [...prev, newBudget]);
    setCategory("");
    setLimit("");
  };

  // ✅ Edit Budget
  const handleEditBudget = async (index, updatedBudget) => {
    const updatedBudgets = [...budgets];
    updatedBudgets[index] = { ...updatedBudgets[index], ...updatedBudget };
    setBudgets(updatedBudgets);

    const userDocRef = doc(db, "users", userId);

    // Update Firestore (replace whole budgets array)
    await updateDoc(doc(db, "users", userId), {
      budgets: updatedBudgets,
    });

    // ✅ If spent increased → subtract from monthlyLimit
    if (updatedBudget.spent !== budgets[index].spent) {
      const diff = updatedBudget.spent - budgets[index].spent;
      if (diff > 0) {
        const userDocRef = doc(db, "users", userId);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          const { monthlyLimit } = userSnap.data();
          await updateDoc(userDocRef, {
            monthlyLimit: monthlyLimit - diff,
          });
        }
      }
    }

    if (updatedBudget.spent > updatedBudget.limit) {
      await updateDoc(userDocRef, {
        isAlert: true,
        notifications: arrayUnion({
          id: Date.now().toString(),
          title: "Budget Alert 🚨",
          message: `You’ve exceeded your ${updatedBudget.category} budget.`,
          time: new Date().toISOString(),
          isRead: false,
        }),
      });
    }
  };

  // ✅ Delete Budget
  const handleDeleteBudget = async (index) => {
    const updatedBudgets = budgets.filter((_, i) => i !== index);
    setBudgets(updatedBudgets);

    await updateDoc(doc(db, "users", userId), {
      budgets: updatedBudgets,
    });
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
