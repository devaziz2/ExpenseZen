import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function BudgetCard({
  category,
  limit,
  spent,
  onEdit,
  onDelete,
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editCategory, setEditCategory] = useState(category);
  const [editLimit, setEditLimit] = useState(limit.toString());
  const [editSpent, setEditSpent] = useState(spent.toString());

  // Progress bar animation
  const progress = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const dropdownAnim = useRef(new Animated.Value(0)).current;

  // Calculate percentage (clamped to 1 for progress bar)
  const percentage = limit > 0 ? Math.min(spent / limit, 1) : 0;
  const percentageValue = (limit > 0 ? spent / limit : 0) * 100;
  const remaining = limit - spent;

  // Gradient & glow color logic
  const getProgressColor = () => {
    if (percentageValue < 30) {
      return {
        gradient: ["#34D399", "#10B981", "#059669"], // green
        glow: "#6EE7B7",
      };
    } else if (percentageValue >= 30 && percentageValue < 90) {
      return {
        gradient: ["#60A5FA", "#3B82F6", "#1D3F69"], // blue
        glow: "#93C5FD",
      };
    } else {
      return {
        gradient: ["#F87171", "#EF4444", "#DC2626"], // red
        glow: "#FCA5A5",
      };
    }
  };

  const colors = getProgressColor();

  useEffect(() => {
    Animated.timing(progress, {
      toValue: percentage * 100, // ✅ just percentage 0–100
      duration: 1200,
      useNativeDriver: false,
    }).start();

    if (percentageValue >= 60) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: false,
          }),
        ])
      ).start();
    }
  }, [percentage, percentageValue]);

  useEffect(() => {
    if (showDropdown) {
      Animated.spring(dropdownAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    } else {
      Animated.spring(dropdownAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    }
  }, [showDropdown]);

  const handleEdit = () => {
    setShowDropdown(false);
    setShowEditModal(true);
  };

  const handleDelete = () => {
    setShowDropdown(false);
    Alert.alert(
      "Delete Budget",
      `Are you sure you want to delete the "${category}" budget?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => onDelete(),
        },
      ],
      { cancelable: true }
    );
  };

  const handleSaveEdit = () => {
    if (!editCategory.trim() || !editLimit || !editSpent) return;

    onEdit({
      category: editCategory.trim(),
      limit: parseFloat(editLimit),
      spent: parseFloat(editSpent),
    });
    setShowEditModal(false);
  };

  return (
    <>
      <LinearGradient
        colors={["rgba(255,255,255,0.9)", "rgba(220,235,250,0.6)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        {/* Header Row */}
        <View style={styles.cardRow}>
          <Text style={styles.category}>{category}</Text>
          <View style={styles.headerRight}>
            <Text style={styles.limit}>${limit}</Text>
            <TouchableOpacity
              onPress={() => setShowDropdown(!showDropdown)}
              style={styles.menuButton}
              activeOpacity={0.7}
            >
              <Ionicons name="ellipsis-vertical" size={18} color="#1D3F69" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Dropdown Menu */}
        {showDropdown && (
          <Animated.View
            style={[
              styles.dropdown,
              {
                transform: [
                  {
                    scale: dropdownAnim,
                  },
                  {
                    translateY: dropdownAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-10, 0],
                    }),
                  },
                ],
                opacity: dropdownAnim,
              },
            ]}
          >
            <TouchableOpacity
              onPress={handleEdit}
              style={styles.dropdownItem}
              activeOpacity={0.8}
            >
              <Ionicons name="create-outline" size={16} color="#1D3F69" />
              <Text style={styles.dropdownText}>Edit</Text>
            </TouchableOpacity>
            <View style={styles.dropdownDivider} />
            <TouchableOpacity
              onPress={handleDelete}
              style={styles.dropdownItem}
              activeOpacity={0.8}
            >
              <Ionicons name="trash-outline" size={16} color="#E63946" />
              <Text style={[styles.dropdownText, { color: "#E63946" }]}>
                Delete
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Spent & Remaining */}
        <Text style={styles.spent}>Spent: ${spent}</Text>
        <Text
          style={[
            styles.remaining,
            { color: remaining < 0 ? "#E63946" : "#2A9D8F" }, // ✅ red if exceeded
          ]}
        >
          Remaining: ${remaining}
        </Text>

        {/* Animated Progress Bar */}
        <View style={styles.progressContainer}>
          {/* Track */}
          <LinearGradient
            colors={["#F3F4F6", "#E5E7EB", "#D1D5DB"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.track}
          />

          {/* Progress */}
          <Animated.View
            style={[
              styles.progressWrapper,
              {
                width: progress.interpolate({
                  inputRange: [0, 100],
                  outputRange: ["0%", "100%"], // ✅ stays inside track
                }),
                shadowColor: colors.glow,
                shadowOpacity: glowAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.3, 0.8],
                }),
                shadowRadius: glowAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [4, 10],
                }),
              },
            ]}
          >
            <LinearGradient
              colors={colors.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.progress}
            />
          </Animated.View>
        </View>
      </LinearGradient>

      {/* Edit Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Budget</Text>
            <Text style={{ marginLeft: 5 }}>Category</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Category"
              placeholderTextColor="#9CA3AF"
              value={editCategory}
              onChangeText={setEditCategory}
            />
            <Text style={{ marginLeft: 5 }}>Limit</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Limit"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              value={editLimit}
              onChangeText={setEditLimit}
            />
            <Text style={{ marginLeft: 5 }}>Spent</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Spent"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              value={editSpent}
              onChangeText={setEditSpent}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setShowEditModal(false)}
                style={[styles.modalButton, styles.cancelButton]}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSaveEdit}
                style={[styles.modalButton, styles.saveButton]}
                activeOpacity={0.8}
              >
                <Text style={styles.saveButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
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
    position: "relative",
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  category: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1D3F69",
    flex: 1,
  },
  limit: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginRight: 10,
  },
  menuButton: {
    padding: 4,
  },
  dropdown: {
    position: "absolute",
    top: 40,
    right: 18,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    zIndex: 1000,
    minWidth: 120,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dropdownText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "500",
    color: "#1D3F69",
  },
  dropdownDivider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginHorizontal: 8,
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
    marginBottom: 10,
  },
  progressContainer: {
    width: "100%",
    position: "relative",
    marginTop: 5,
  },
  track: {
    height: 12,
    borderRadius: 10,
    width: "100%",
  },
  progressWrapper: {
    position: "absolute",
    height: 12,
    borderRadius: 10,
    overflow: "hidden",
  },
  progress: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1D3F69",
    textAlign: "center",
    marginBottom: 24,
  },
  modalInput: {
    borderWidth: 0.8,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    fontSize: 16,
    color: "#1D3F69",
    marginTop: 5,
    backgroundColor: "#F9FAFB",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#F3F4F6",
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: "#1D3F69",
    marginLeft: 8,
  },
  cancelButtonText: {
    color: "#6B7280",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
