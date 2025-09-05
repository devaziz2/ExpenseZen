import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Modal,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileScreen() {
  const [name, setName] = useState("John Doe");
  const [email] = useState("johndoe@email.com");
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(name);

  const handleSave = () => {
    if (newName.trim()) setName(newName);
    setEditing(false);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message:
          "Hey! 👋 I’m using ExpenseZen app – it’s super helpful for expense tracking. You should try it too!",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      {/* User Icon */}
      <View style={styles.avatarWrapper}>
        <Ionicons
          name="person-circle"
          size={120}
          color="#1D3F69"
          style={styles.avatar}
        />
      </View>

      {/* Details Card */}
      <View style={styles.detailsCard}>
        {/* Name */}
        <Text style={styles.label}>Name</Text>
        <View style={styles.inputField}>
          <Text style={styles.value}>{name}</Text>
        </View>

        {/* Email */}
        <Text style={styles.label}>Email</Text>
        <View style={[styles.inputField, styles.disabledInput]}>
          <Text style={styles.value}>{email}</Text>
        </View>
      </View>

      {/* Edit Profile Button */}
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => setEditing(true)}
      >
        <MaterialCommunityIcons name="account-edit" size={20} color="white" />
        <Text style={styles.editText}>Edit Profile</Text>
      </TouchableOpacity>

      {/* Share App Button */}
      <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
        <Ionicons name="share-social" size={20} color="white" />
        <Text style={styles.shareText}>Share app with friends</Text>
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
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelBtn]}
                onPress={() => setEditing(false)}
              >
                <Text style={{ color: "#555" }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveBtn]}
                onPress={handleSave}
              >
                <Text style={{ color: "white", fontWeight: "600" }}>Save</Text>
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
    alignItems: "center",
    paddingTop: 60,
  },
  avatarWrapper: {
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
    borderRadius: 100,
    marginBottom: 25,
  },
  avatar: {
    borderRadius: 100,
  },
  detailsCard: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 18,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
  },
  inputField: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 18,
    backgroundColor: "#F9FAFB",
  },
  disabledInput: {
    backgroundColor: "#E5E7EB",
  },
  value: {
    fontSize: 16,
    color: "#1D3F69",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1D3F69",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
  },
  editText: {
    color: "white",
    marginLeft: 8,
    fontWeight: "600",
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3B82F6",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    elevation: 3,
  },
  shareText: {
    color: "white",
    marginLeft: 8,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
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
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 24,
    fontSize: 16,
    backgroundColor: "#F9FAFB",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  modalButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    marginLeft: 12,
  },
  cancelBtn: {
    backgroundColor: "#F3F4F6",
  },
  saveBtn: {
    backgroundColor: "#1D3F69",
  },
});
