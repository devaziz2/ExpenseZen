import { StyleSheet, Text, View } from "react-native";

export default function NotificationCard({ item }) {
  const dateObj = new Date(item.time);
  const formattedTime = dateObj.toLocaleString("en-US", {
    dateStyle: "medium", // Sep 17, 2025
    timeStyle: "short", // 7:11 PM
  });

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: item.isRead ? "#FFF2F2" : "#FFD6D6" },
      ]}
    >
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.message}>{item.message}</Text>
      <Text style={styles.time}>{formattedTime}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#FFADAD",
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1D3F69",
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 8,
  },
  time: {
    fontSize: 12,
    color: "#6B7280",
  },
});
