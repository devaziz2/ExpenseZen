import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

const CustomButton = ({ title, onPress, type = "primary", loading }) => {
  return (
    <TouchableOpacity
      style={[styles.button, type === "secondary" && styles.secondary]}
      onPress={!loading ? onPress : null}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={type === "secondary" ? "#1D3F69" : "#fff"}
        />
      ) : (
        <Text
          style={[styles.text, type === "secondary" && { color: "#1D3F69" }]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#1D3F69",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
    elevation: 3,
  },
  secondary: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#1D3F69",
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CustomButton;
