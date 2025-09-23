import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { updatePassword } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import Toast from "react-native-toast-message";
import { auth, db } from "../../firebase";

export default function ProfileScreen() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [changingPass, setChangingPass] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  // ✅ Load from AsyncStorage
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("userData");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setNewName(parsedUser.name);
        }
      } catch (error) {
        console.log("Error loading user:", error);
      }
    };
    loadUserData();
  }, []);

  // ✅ Save updated name in Firebase + AsyncStorage
  const handleSaveName = async () => {
    if (!newName.trim()) return;

    try {
      const userDocRef = doc(db, "users", user.id); // assumes your users are stored in "users" collection
      await updateDoc(userDocRef, { fullName: newName });

      const updatedUser = { ...user, fullName: newName };
      setUser(updatedUser);

      await AsyncStorage.setItem("userData", JSON.stringify(updatedUser));
      Toast.show({
        type: "success",
        text1: "Updated",
        text2: "Name updated successfully!",
        visibilityTime: 2500,
        position: "top",
      });
    } catch (error) {
      console.log("Error updating name:", error);
      Alert.alert("Error", "Could not update name");
    }

    setEditing(false);
  };

  // ✅ Change password in Firebase Auth
  const handleChangePassword = async () => {
    if (newPassword.trim().length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return;
    }

    try {
      await updatePassword(auth.currentUser, newPassword);

      const updatedUser = { ...user, password: newPassword };
      setUser(updatedUser);
      await AsyncStorage.setItem("userData", JSON.stringify(updatedUser));

      Toast.show({
        type: "success",
        text1: "Updated",
        text2: "Password updated successfully!",
        visibilityTime: 2500,
        position: "top",
      });
    } catch (error) {
      console.log("Error updating password:", error);
      Alert.alert("Error", error.message || "Could not update password");
    }

    setChangingPass(false);
  };

  // ✅ Logout
  const handleLogout = async () => {
    await AsyncStorage.clear();
    router.replace("/auth/Login"); // redirect to login screen
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message:
          "Hey! 👋 I’m using ExpenseZen – the easiest way to manage expenses. Try it out!",
      });
    } catch (error) {
      console.log(error);
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Loading user...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Avatar */}
      <View style={styles.avatarWrapper}>
        <Ionicons name="person-circle" size={120} color="#1D3F69" />
      </View>

      {/* User Details */}
      <View style={styles.detailsCard}>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{user?.fullName}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.detailRow}>
          <Text style={styles.label}>Email</Text>
          <Text style={[styles.value, { color: "#6B7280" }]}>{user.email}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={[styles.actionBtn, styles.primaryBtn]}>
          <MaterialCommunityIcons name="account-edit" size={20} color="white" />
          <Text style={styles.actionText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.secondaryBtn]}
          onPress={handleShare}
        >
          <Ionicons name="share-social" size={20} color="white" />
          <Text style={styles.actionText}>Share App</Text>
        </TouchableOpacity>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="white" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* Edit Modal */}
      <Modal visible={editing} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Name</Text>
            <TextInput
              value={newName}
              onChangeText={setNewName}
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor="#9CA3AF"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelBtn]}
                onPress={() => setEditing(false)}
              >
                <Text style={{ color: "#374151", fontWeight: "500" }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveBtn]}
                onPress={handleSaveName}
              >
                <Text style={{ color: "white", fontWeight: "600" }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={changingPass} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change Password</Text>
            <TextInput
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              style={styles.input}
              placeholder="Enter new password"
              placeholderTextColor="#9CA3AF"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelBtn]}
                onPress={() => setChangingPass(false)}
              >
                <Text style={{ color: "#374151", fontWeight: "500" }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveBtn]}
                onPress={handleChangePassword}
              >
                <Text style={{ color: "white", fontWeight: "600" }}>
                  Update
                </Text>
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
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    paddingTop: 60,
  },
  avatarWrapper: {
    marginBottom: 25,
  },
  detailsCard: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  detailRow: {
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 12,
  },
  label: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1D3F69",
  },
  actions: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    marginHorizontal: 6,
  },
  primaryBtn: {
    backgroundColor: "#1D3F69",
  },
  secondaryBtn: {
    backgroundColor: "#3B82F6",
  },
  actionText: {
    color: "white",
    marginLeft: 8,
    fontWeight: "600",
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EF4444",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
  },
  logoutText: {
    color: "white",
    marginLeft: 8,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 24,
    width: "100%",
    maxWidth: 360,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 20,
    color: "#1D3F69",
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 24,
    fontSize: 16,
    backgroundColor: "#F9FAFB",
    color: "#111827",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  modalButton: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
    marginLeft: 12,
  },
  cancelBtn: {
    backgroundColor: "#F3F4F6",
  },
  saveBtn: {
    backgroundColor: "#1D3F69",
  },
});
