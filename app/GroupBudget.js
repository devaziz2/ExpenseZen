import { db } from "@/firebase";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import { useEffect, useState } from "react";

import {
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

export default function GroupBudgetsScreen() {
  const [userID, setUserID] = useState(null);
  const [groupBudgets, setGroupBudgets] = useState([]);
  const router = useRouter();
  // Add budget modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newTotal, setNewTotal] = useState("");
  const [newPerHead, setNewPerHead] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [members, setMembers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  // Pay modal states
  const [showPayModal, setShowPayModal] = useState(false);
  const [currentBudgetId, setCurrentBudgetId] = useState(null);
  const [payAmount, setPayAmount] = useState("");

  // Load user ID from AsyncStorage
  useEffect(() => {
    const loadUserData = async () => {
      const storedUser = await AsyncStorage.getItem("userData");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUserID(parsedUser.id);
      }
    };
    loadUserData();
  }, []);

  // Realtime fetch budgets
  useFocusEffect(() => {
    if (!userID) return;

    const q = query(collection(db, "groupBudgets"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs
        .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
        .filter((budget) => budget.members.some((m) => m.id === userID));
      setGroupBudgets(data);
    });

    return () => unsubscribe();
  }, [userID]);

  // Search user by email (realtime suggestions)
  useEffect(() => {
    const searchUser = async () => {
      if (memberEmail.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      try {
        const q = query(
          collection(db, "users"),
          where("email", ">=", memberEmail),
          where("email", "<=", memberEmail + "\uf8ff")
        );
        const querySnapshot = await getDocs(q);

        const results = querySnapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));

        setSearchResults(results);
      } catch (error) {
        console.error("Error searching users:", error);
      }
    };

    searchUser();
  }, [memberEmail]);

  // Select user from dropdown
  const handleSelectUser = (user) => {
    if (!members.some((m) => m.id === user.id)) {
      setMembers((prev) => [
        ...prev,
        { id: user.id, firstName: user.fullName },
      ]);
    }
    setMemberEmail("");
    setSearchResults([]);
  };

  // Add new budget
  const handleAddGroupBudget = async () => {
    if (!newTitle || !newTotal || !newPerHead || members.length === 0) return;

    const newBudget = {
      title: newTitle,
      totalAmount: parseFloat(newTotal),
      perHead: parseFloat(newPerHead),
      members: [...members, { id: userID, firstName: "You", paid: false }],
      createdAt: new Date(),
      createdBy: userID,
    };

    try {
      const docRef = await addDoc(collection(db, "groupBudgets"), newBudget);

      // ✅ add reference to each member's subcollection
      const allMembers = [...members, { id: userID, firstName: "You" }];
      for (const member of allMembers) {
        const userBudgetRef = doc(
          db,
          "users",
          member.id,
          "groupBudgets",
          docRef.id
        );
        await setDoc(userBudgetRef, {
          budgetId: docRef.id,
          title: newBudget.title,
          totalAmount: newBudget.totalAmount,
          perHead: newBudget.perHead,
          createdAt: new Date(),
        });
      }

      setNewTitle("");
      setNewTotal("");
      setNewPerHead("");
      setMembers([]);
      setShowAddModal(false);
    } catch (error) {
      console.error("Error adding budget:", error);
    }
  };

  // Delete budget
  const handleDelete = async (id) => {
    Alert.alert("Delete Group", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteDoc(doc(db, "groupBudgets", id));
            setGroupBudgets((prev) => prev.filter((b) => b.id !== id));
          } catch (error) {
            console.error("Error deleting budget:", error);
          }
        },
      },
    ]);
  };

  // Open pay modal
  const openPayModal = (id, perHead) => {
    setCurrentBudgetId(id);
    setPayAmount(perHead.toString()); // ✅ auto-fill per head
    setShowPayModal(true);
  };

  // Handle pay
  const handlePay = async () => {
    if (!payAmount || !userID) return;

    try {
      // ✅ subtract from user's monthlyLimit
      const userRef = doc(db, "users", userID);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const amount = parseFloat(payAmount);

        const updatedLimit = (userData.monthlyLimit || 0) - amount;
        const updatedSpendings = (userData.spendings || 0) + amount;

        await updateDoc(userRef, {
          monthlyLimit: updatedLimit,
          spendings: updatedSpendings,
        });
      }

      // ✅ update budget as paid for this user
      const budgetRef = doc(db, "groupBudgets", currentBudgetId);
      const budgetSnap = await getDoc(budgetRef);

      if (budgetSnap.exists()) {
        const budgetData = budgetSnap.data();
        const updatedMembers = budgetData.members.map((m) =>
          m.id === userID ? { ...m, paid: true } : m
        );
        await updateDoc(budgetRef, { members: updatedMembers });
      }

      setPayAmount("");
      setShowPayModal(false);
    } catch (error) {
      console.error("Error paying:", error);
    }
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
        {groupBudgets.map((budget) => {
          const currentUser = budget.members.find((m) => m.id === userID);
          const isPaid = currentUser?.paid || false;

          return (
            <View key={budget.id} style={styles.card}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{budget.title}</Text>
                <Text style={styles.cardSub}>
                  Total: ${budget.totalAmount} | Per Head: ${budget.perHead}
                </Text>
                <Text style={styles.cardMembers}>
                  Members: {budget.members.map((m) => m.firstName).join(", ")}
                </Text>

                {isPaid ? (
                  <View style={styles.paidRow}>
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color="#10B981"
                    />
                    <Text style={styles.paidText}>Paid</Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.payButton}
                    onPress={() => openPayModal(budget.id, budget.perHead)}
                  >
                    <Ionicons name="card-outline" size={18} color="white" />
                    <Text style={styles.payButtonText}>Pay Your Share</Text>
                  </TouchableOpacity>
                )}
              </View>
              {budget.createdBy === userID && (
                <TouchableOpacity onPress={() => handleDelete(budget.id)}>
                  <Ionicons name="trash-outline" size={22} color="#DC2626" />
                </TouchableOpacity>
              )}
            </View>
          );
        })}
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

            {/* Search member by email */}
            <TextInput
              style={styles.modalInput}
              placeholder="Enter Member Email"
              value={memberEmail}
              onChangeText={setMemberEmail}
            />

            {searchResults.length > 0 && (
              <FlatList
                data={searchResults}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => handleSelectUser(item)}
                  >
                    <Text>{item.email}</Text>
                  </TouchableOpacity>
                )}
                style={styles.dropdown}
              />
            )}

            {members.length > 0 && (
              <Text style={{ marginVertical: 5 }}>
                Members: {members.map((m) => m.firstName).join(", ")}
              </Text>
            )}

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
            <Text style={styles.modalTitle}>
              Are you sure you want to pay ${payAmount}?
            </Text>
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
                <Text style={styles.saveButtonText}>Yes, Pay</Text>
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

  dropdown: {
    maxHeight: 120,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginVertical: 4,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
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
