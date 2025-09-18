// TransferMoneyScreen.jsx
import { db } from "@/firebase";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";

import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function TransferMoneyScreen() {
  const router = useRouter();

  // Core states
  const [monthlyLimit, setMonthlyLimit] = useState(3000);
  const [totalAmount, setTotalAmount] = useState(1200.5);
  const [savingAmount, setSavingAmount] = useState(450.25);

  // Modals
  const [showEditLimit, setShowEditLimit] = useState(false);
  const [tmpMonthlyLimit, setTmpMonthlyLimit] = useState(String(monthlyLimit));
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [tmpAddAmount, setTmpAddAmount] = useState("");

  // Transfer
  const [direction, setDirection] = useState("walletToSaving");
  const [transferAmount, setTransferAmount] = useState("");
  const [inputError, setInputError] = useState("");
  const [isTransferring, setIsTransferring] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [userID, setUserID] = useState();
  const [user, setUser] = useState(null);

  // ✅ Load userID once
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

  // ✅ Fetch Firestore data whenever screen comes into focus
  useFocusEffect(
    useCallback(() => {
      const fetchUserData = async () => {
        if (!userID) return;
        try {
          const userDoc = await getDoc(doc(db, "users", userID));
          if (userDoc.exists()) {
            setUser(userDoc.data());
            const data = userDoc.data();
            setMonthlyLimit(data.monthlyLimit);
            setSavingAmount(data.savings);
            setTotalAmount(data.balance);
            console.log("Actual users data again get...");
          }
        } catch (err) {
          console.log("Error fetching user data:", err);
        }
      };

      fetchUserData();
    }, [userID])
  );

  const fmt = (n) => "$" + (Number(n) || 0).toFixed(2);

  const validateTransfer = (amount) => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setInputError("Enter a valid amount.");
      return false;
    }
    const a = Number(amount);
    if (direction === "walletToSaving" && a > totalAmount) {
      setInputError("Insufficient wallet balance.");
      return false;
    }
    if (direction === "savingToWallet" && a > savingAmount) {
      setInputError("Insufficient saving balance.");
      return false;
    }
    setInputError("");
    return true;
  };

  // ✅ Validate + Transfer Money
  const handleTransfer = async () => {
    if (!validateTransfer(transferAmount)) return;
    const amt = Number(transferAmount);

    setIsTransferring(true);

    try {
      const userRef = doc(db, "users", userID);

      let newWallet = totalAmount;
      let newSaving = savingAmount;

      if (direction === "walletToSaving") {
        newWallet = +(totalAmount - amt).toFixed(2);
        newSaving = +(savingAmount + amt).toFixed(2);
      } else {
        newWallet = +(totalAmount + amt).toFixed(2);
        newSaving = +(savingAmount - amt).toFixed(2);
      }

      // ✅ Update in Firestore
      await updateDoc(userRef, {
        balance: newWallet,
        savings: newSaving,
      });

      // ✅ Update local state
      setTotalAmount(newWallet);
      setSavingAmount(newSaving);

      setShowSuccess(true);
      setTransferAmount("");
    } catch (err) {
      console.log("Transfer error:", err);
      setInputError("Something went wrong. Try again.");
    } finally {
      setIsTransferring(false);
    }
  };

  // ✅ Edit Monthly Limit
  const handleSaveLimit = async () => {
    try {
      const newLimit = Number(tmpMonthlyLimit);
      const userRef = doc(db, "users", userID);

      await updateDoc(userRef, { monthlyLimit: newLimit });

      setMonthlyLimit(newLimit);
      setShowEditLimit(false);
    } catch (err) {
      console.log("Error updating monthly limit:", err);
    }
  };

  // ✅ Add Money to Wallet
  const handleAddMoney = async () => {
    try {
      const amt = Number(tmpAddAmount);
      if (!amt || amt <= 0) {
        setInputError("Enter a valid amount.");
        return;
      }

      const newWallet = totalAmount + amt;
      const userRef = doc(db, "users", userID);

      await updateDoc(userRef, { balance: newWallet });

      setTotalAmount(newWallet);
      setTmpAddAmount("");
      setShowAddMoney(false);
    } catch (err) {
      console.log("Error adding money:", err);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerr}>
        <View />
        <Text style={styles.headerTitlee}>Transfer Money</Text>
        <View style={{ width: 30 }} />
      </View>

      {/* Gradient Summary Card */}
      <LinearGradient
        colors={["#0F172A", "#1D4ED8"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.summaryCard}
      >
        <View style={styles.cardTopRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitleLight}>My Wallet</Text>
            <Text style={styles.cardBigAmount}>{fmt(totalAmount)}</Text>
            <TouchableOpacity onPress={() => setShowAddMoney(true)}>
              <Text style={styles.linkText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Monthly Limit</Text>
            <Text style={styles.statValueLight}>{fmt(monthlyLimit)}</Text>
            <TouchableOpacity
              onPress={() => {
                setTmpMonthlyLimit(String(monthlyLimit));
                setShowEditLimit(true);
              }}
            >
              <Text style={styles.linkText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Saving</Text>
            <Text style={styles.statValueLight}>{fmt(savingAmount)}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Transfer Section */}
      <View style={styles.transferCard}>
        <Text style={styles.sectionTitle}>Transfer</Text>

        {/* Direction toggles */}
        <View style={styles.directionRow}>
          <TouchableOpacity
            style={[
              styles.directionButton,
              direction === "walletToSaving" && styles.directionButtonActive,
            ]}
            onPress={() => setDirection("walletToSaving")}
          >
            <Text
              style={[
                styles.directionText,
                direction === "walletToSaving" && styles.directionTextActive,
              ]}
            >
              Wallet to Saving
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.directionButton,
              direction === "savingToWallet" && styles.directionButtonActive,
            ]}
            onPress={() => setDirection("savingToWallet")}
          >
            <Text
              style={[
                styles.directionText,
                direction === "savingToWallet" && styles.directionTextActive,
              ]}
            >
              Saving to Wallet
            </Text>
          </TouchableOpacity>
        </View>

        {/* Show balances under selected direction */}
        <View style={styles.balanceRow}>
          <Text style={styles.balanceText}>Wallet: {fmt(totalAmount)}</Text>
          <MaterialCommunityIcons
            name="swap-horizontal"
            size={22}
            color="#2563EB"
            style={{ marginHorizontal: 8 }}
          />
          <Text style={styles.balanceText}>Saving: {fmt(savingAmount)}</Text>
        </View>

        {/* Transfer input */}
        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={80}>
          <View style={styles.inputWrap}>
            <TextInput
              placeholder="Enter amount"
              keyboardType="numeric"
              value={transferAmount}
              onChangeText={setTransferAmount}
              style={[
                styles.transferInput,
                inputError ? styles.inputErrorOutline : null,
              ]}
              editable={!isTransferring}
            />
          </View>
          {inputError ? (
            <Text style={styles.errorText}>{inputError}</Text>
          ) : null}

          {/* Loader or Button */}
          {isTransferring ? (
            <View style={styles.loaderWrap}>
              <ActivityIndicator size="large" color="#2563EB" />
              <Text
                style={{ marginTop: 8, color: "#2563EB", fontWeight: "600" }}
              >
                Transferring...
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.transferBtn}
              onPress={handleTransfer}
            >
              <MaterialCommunityIcons
                name="arrow-right"
                size={18}
                color="#fff"
              />
              <Text style={styles.transferBtnText}>Confirm Transfer</Text>
            </TouchableOpacity>
          )}
        </KeyboardAvoidingView>
      </View>

      {/* Success Popup */}
      <Modal visible={showSuccess} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Ionicons name="checkmark-circle" size={64} color="#22C55E" />
            <Text style={styles.modalTitle}>Success</Text>
            <Text style={{ textAlign: "center", marginTop: 8 }}>
              Money transferred from{" "}
              {direction === "walletToSaving"
                ? "Wallet → Saving"
                : "Saving → Wallet"}
            </Text>
            <TouchableOpacity
              style={[styles.modalBtn, styles.saveBtn, { marginTop: 16 }]}
              onPress={() => setShowSuccess(false)}
            >
              <Text style={styles.saveBtnText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Edit Monthly Limit Modal */}
      <Modal
        visible={showEditLimit}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddMoney(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Edit Monthly Limit</Text>
            <TextInput
              placeholder="Enter new limit"
              keyboardType="numeric"
              value={tmpMonthlyLimit}
              onChangeText={setTmpMonthlyLimit}
              style={styles.transferInput}
            />
            <TouchableOpacity
              style={[styles.modalBtn, styles.saveBtn, { marginTop: 16 }]}
              onPress={handleSaveLimit}
            >
              <Text style={styles.saveBtnText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add Money Modal */}
      <Modal
        visible={showAddMoney}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddMoney(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Add Money to Wallet</Text>
            <TextInput
              placeholder="Enter amount"
              keyboardType="numeric"
              value={tmpAddAmount}
              onChangeText={setTmpAddAmount}
              style={styles.transferInput}
            />
            <TouchableOpacity
              style={[styles.modalBtn, styles.saveBtn, { marginTop: 16 }]}
              onPress={handleAddMoney}
            >
              <Text style={styles.saveBtnText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
    paddingHorizontal: 18,
    paddingTop: 50,
  },
  headerr: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  headerTitlee: { fontSize: 18, fontWeight: "700", color: "#0F172A" },

  summaryCard: { borderRadius: 16, padding: 18, marginBottom: 18 },
  cardTopRow: { flexDirection: "row", alignItems: "center" },
  cardTitleLight: {
    color: "rgba(255,255,255,0.9)",
    fontWeight: "600",
    fontSize: 13,
  },
  cardBigAmount: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "800",
    marginTop: 4,
  },
  statsRow: {
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statCard: { flex: 1, marginRight: 8 },
  statLabel: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
  },
  statValueLight: { color: "#fff", fontSize: 14, fontWeight: "700" },
  linkText: {
    color: "#93C5FD",
    marginTop: 4,
    fontSize: 13,
    fontWeight: "600",
  },

  transferCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 12,
  },
  directionRow: { flexDirection: "row", marginBottom: 12 },
  directionButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E6EEF9",
    padding: 12,
    borderRadius: 10,
    marginRight: 8,
  },
  directionButtonActive: { backgroundColor: "#E6F0FF", borderColor: "#CDE3FF" },
  directionText: {
    textAlign: "center",
    color: "#2563EB",
    fontWeight: "600",
    fontSize: 13,
  },
  directionTextActive: { color: "#0F172A" },

  balanceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  balanceText: { fontSize: 14, fontWeight: "600", color: "#0F172A" },

  inputWrap: { marginBottom: 8 },
  transferInput: {
    borderWidth: 1,
    borderColor: "#E6EEF9",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#FBFDFF",
    marginTop: 10,
  },
  inputErrorOutline: { borderColor: "#FCA5A5" },
  errorText: {
    color: "#DC2626",
    marginTop: 6,
    fontSize: 13,
    fontWeight: "600",
  },

  loaderWrap: { alignItems: "center", marginTop: 12 },
  transferBtn: {
    marginTop: 12,
    backgroundColor: "#0F172A",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  transferBtnText: {
    color: "#fff",
    fontWeight: "700",
    marginLeft: 8,
    fontSize: 15,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalBox: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
    marginTop: 12,
  },
  modalBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: "center",
  },
  saveBtn: { backgroundColor: "#1D3F69" },
  saveBtnText: { color: "#fff", fontWeight: "800" },
});
