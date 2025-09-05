import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
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

export default function GroupBudgetsScreen() {
  const router = useRouter();

  const [groupBudgets, setGroupBudgets] = useState([
    {
      id: "1",
      title: "Flat Rent",
      totalAmount: 2000,
      perHead: 500,
      members: ["John", "Ali", "Sara", "Tom"],
      paid: false, // ✅ tracks if user paid or not
    },
  ]);

  // Modal states for Add Budget
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newTotal, setNewTotal] = useState("");
  const [newPerHead, setNewPerHead] = useState("");
  const [newMembers, setNewMembers] = useState("");

  // Modal states for Pay
  const [showPayModal, setShowPayModal] = useState(false);
  const [currentBudgetId, setCurrentBudgetId] = useState(null);
  const [payAmount, setPayAmount] = useState("");

  const handleDelete = (id) => {
    Alert.alert(
      "Delete Group",
      "Are you sure you want to delete this budget?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () =>
            setGroupBudgets((prev) =>
              prev.filter((budget) => budget.id !== id)
            ),
        },
      ]
    );
  };

  const handleAddGroupBudget = () => {
    if (!newTitle.trim() || !newTotal || !newPerHead || !newMembers.trim())
      return;

    const membersArray = newMembers
      .split(",")
      .map((m) => m.trim())
      .filter((m) => m.length > 0);

    const newBudget = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      totalAmount: parseFloat(newTotal),
      perHead: parseFloat(newPerHead),
      members: membersArray,
      paid: false,
    };

    setGroupBudgets((prev) => [newBudget, ...prev]);
    setShowAddModal(false);
    setNewTitle("");
    setNewTotal("");
    setNewPerHead("");
    setNewMembers("");
  };

  const openPayModal = (id) => {
    setCurrentBudgetId(id);
    setShowPayModal(true);
  };

  const handlePay = () => {
    if (!payAmount) return;
    setGroupBudgets((prev) =>
      prev.map((budget) =>
        budget.id === currentBudgetId ? { ...budget, paid: true } : budget
      )
    );
    setPayAmount("");
    setShowPayModal(false);
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
        <Text style={styles.headerTitlee}>Group Budgets</Text>
        <View style={{ width: 30 }} />
      </View>

      {/* Summary Card */}
      <LinearGradient
        colors={["#1D3F69", "#3B82F6"]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerRow}>
          <Ionicons name="people-outline" size={26} color="white" />
          <Text style={styles.headerTitle}>My Group Budgets</Text>
        </View>
        <Text style={styles.headerAmount}>{groupBudgets.length}</Text>
      </LinearGradient>

      {/* Group Budgets List */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {groupBudgets.map((budget) => (
          <View key={budget.id} style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{budget.title}</Text>
              <Text style={styles.cardSub}>
                Total: ${budget.totalAmount} | Per Head: ${budget.perHead}
              </Text>
              <Text style={styles.cardMembers}>
                Members: {budget.members.join(", ")}
              </Text>

              {budget.paid ? (
                <View style={styles.paidRow}>
                  <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                  <Text style={styles.paidText}>Paid</Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.payButton}
                  onPress={() => openPayModal(budget.id)}
                >
                  <Ionicons name="card-outline" size={18} color="white" />
                  <Text style={styles.payButtonText}>Pay Your Share</Text>
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity onPress={() => handleDelete(budget.id)}>
              <Ionicons name="trash-outline" size={22} color="#DC2626" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowAddModal(true)}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>

      {/* Add Budget Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Group Budget</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Budget Title"
              value={newTitle}
              onChangeText={setNewTitle}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Total Amount"
              value={newTotal}
              onChangeText={setNewTotal}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Per Head Amount"
              value={newPerHead}
              onChangeText={setNewPerHead}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Members (comma separated)"
              value={newMembers}
              onChangeText={setNewMembers}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setShowAddModal(false)}
                style={[styles.modalButton, styles.cancelButton]}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleAddGroupBudget}
                style={[styles.modalButton, styles.saveButton]}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Pay Modal */}
      <Modal
        visible={showPayModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPayModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Pay Your Share</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Enter Amount"
              value={payAmount}
              onChangeText={setPayAmount}
              keyboardType="numeric"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setShowPayModal(false)}
                style={[styles.modalButton, styles.cancelButton]}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handlePay}
                style={[styles.modalButton, styles.saveButton]}
              >
                <Text style={styles.saveButtonText}>Pay</Text>
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

  // Summary Card
  header: {
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 4,
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

  // Group Card
  card: {
    backgroundColor: "white",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1D3F69",
    marginBottom: 4,
  },
  cardSub: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 4,
  },
  cardMembers: {
    fontSize: 13,
    color: "#6B7280",
  },
  paidRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  paidText: {
    color: "#10B981",
    fontWeight: "600",
    marginLeft: 4,
  },
  payButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    backgroundColor: "#2563EB",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  payButtonText: {
    color: "white",
    fontWeight: "600",
    marginLeft: 6,
  },

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
    elevation: 6,
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
