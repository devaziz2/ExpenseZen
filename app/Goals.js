import { db } from "@/firebase";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import SavingGoalCard from "../components/sections/goals/GoalsCard";

export default function GoalsScreen() {
  const [totalSaved, setTotalSaved] = useState(0);
  const [goals, setGoals] = useState([]);
  const [userId, setUserId] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newRequired, setNewRequired] = useState("");
  const [newDate, setNewDate] = useState("");
  const router = useRouter();

  // ✅ Load user data
  useEffect(() => {
    const loadUserData = async () => {
      const storedUser = await AsyncStorage.getItem("userData");
      if (!storedUser) return;

      const parsedUser = JSON.parse(storedUser);
      const savings = parsedUser.savings;
      const uid = parsedUser.id;
      setUserId(uid);
      setTotalSaved(savings);

      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        setGoals(userDoc.data().goals || []);
      }
    };

    loadUserData();
  }, []);

  // ✅ Check for achievements
  useEffect(() => {
    const checkGoals = async () => {
      if (!userId || goals.length === 0) return;

      const today = new Date();
      const userRef = doc(db, "users", userId);
      let updated = false;

      for (let goal of goals) {
        const target = new Date(goal.targetDate);
        const diffDays = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
        if (diffDays <= 7 && totalSaved >= goal.required && !goal.completed) {
          goal.completed = true;
          updated = true;

          const snap = await getDoc(userRef);
          if (snap.exists()) {
            const { goalsComplete = 0 } = snap.data();
            await updateDoc(userRef, {
              goals: goals,
              goalsComplete: goalsComplete + 1,
            });
          }
        }
      }

      if (updated) setGoals([...goals]);
    };

    checkGoals();
  }, [goals, totalSaved, userId]);

  const handleDelete = async (id) => {
    const updatedGoals = goals.filter((goal) => goal.id !== id);
    setGoals(updatedGoals);
    if (userId) {
      await updateDoc(doc(db, "users", userId), { goals: updatedGoals });
    }
  };

  const handleAddGoal = async () => {
    if (!newTitle.trim() || !newRequired || !newDate) {
      Alert.alert("Validation", "All fields are required.");
      return;
    }

    // Validate date format yyyy-mm-dd
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(newDate)) {
      Alert.alert("Validation", "Date must be in YYYY-MM-DD format.");
      return;
    }

    const targetDate = new Date(newDate);
    if (targetDate <= new Date()) {
      Alert.alert("Validation", "Date must be in the future.");
      return;
    }

    const newGoal = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      required: parseFloat(newRequired),
      targetDate: newDate,
      completed: false,
    };

    const updatedGoals = [newGoal, ...goals];
    setGoals(updatedGoals);

    if (userId) {
      await updateDoc(doc(db, "users", userId), { goals: updatedGoals });
    }

    setShowAddModal(false);
    setNewTitle("");
    setNewRequired("");
    setNewDate("");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerr}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={22} color="#1D3F69" />
        </TouchableOpacity>
        <Text style={styles.headerTitlee}>Saving Goals</Text>
        <View style={{ width: 30 }} />
      </View>

      {/* Total Saved Card with gradient */}
      <LinearGradient
        colors={["#1D3F69", "#3B82F6"]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerRow}>
          <Ionicons name="wallet-outline" size={26} color="white" />
          <Text style={styles.headerTitle}>Total Saved</Text>
        </View>
        <Text style={styles.headerAmount}>${totalSaved}</Text>
      </LinearGradient>

      {/* Goals List */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {goals.map((goal) => (
          <SavingGoalCard
            key={goal.id}
            {...goal}
            totalSaved={totalSaved}
            onDelete={() => handleDelete(goal.id)}
          />
        ))}
        {goals.length === 0 && (
          <View style={{ padding: 40, alignItems: "center" }}>
            <Ionicons name="trophy-outline" size={64} color="#9CA3AF" />
            <Text style={{ marginTop: 10, color: "#6B7280", fontSize: 16 }}>
              No goals yet. Add your first goal!
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowAddModal(true)}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>

      {/* Add Goal Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Goal</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Goal Title"
              value={newTitle}
              onChangeText={setNewTitle}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Required Amount"
              value={newRequired}
              onChangeText={setNewRequired}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Target Date (YYYY-MM-DD)"
              value={newDate}
              onChangeText={setNewDate}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setShowAddModal(false)}
                style={[styles.modalButton, styles.cancelButton]}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleAddGoal}
                style={[styles.modalButton, styles.saveButton]}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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

  headerr: {
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
  headerTitlee: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1D3F69",
    textAlign: "center",
  },

  // Total Saved Card
  header: {
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    marginLeft: 8,
  },
  headerAmount: {
    fontSize: 28,
    fontWeight: "800",
    color: "white",
    marginTop: 6,
  },

  scrollContent: { paddingBottom: 100 },

  // Floating Button
  fab: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#1D3F69",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 20,
    width: "100%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1D3F69",
    textAlign: "center",
    marginBottom: 20,
  },
  modalInput: {
    borderWidth: 0.8,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 14,
    fontSize: 16,
    backgroundColor: "#F9FAFB",
  },
  modalButtons: { flexDirection: "row", justifyContent: "space-between" },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelButton: { backgroundColor: "#F3F4F6", marginRight: 8 },
  saveButton: { backgroundColor: "#1D3F69", marginLeft: 8 },
  cancelButtonText: { color: "#6B7280", fontWeight: "600" },
  saveButtonText: { color: "white", fontWeight: "600" },
});
