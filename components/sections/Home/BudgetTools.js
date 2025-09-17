import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const cardSize = (width - 60) / 2;

export default function BudgetingTools() {
  const router = useRouter();

  const tools = [
    {
      title: "My Budget",
      icon: <FontAwesome5 name="balance-scale" size={30} color="#1D3F69" />,
      route: "/Budget",
    },
    {
      title: "Saving Goals",
      icon: <FontAwesome5 name="hand-holding-usd" size={30} color="#1D3F69" />,
      route: "/Goals",
    },
    {
      title: "Group Budgets",
      icon: <FontAwesome5 name="users" size={30} color="#1D3F69" />,
      route: "/GroupBudget",
    },
    {
      title: "Leaderboard",
      icon: <FontAwesome5 name="medal" size={30} color="#1D3F69" />,
      route: "/Ranks",
    },
  ];

  return (
    <View style={styles.section}>
      <Text style={styles.heading}>Budgeting Tools</Text>
      <View style={styles.grid}>
        {tools.map((tool, index) => (
          <TouchableOpacity
            key={index}
            style={styles.cardWrapper}
            activeOpacity={0.85}
            onPress={() => router.push(tool.route)}
          >
            <LinearGradient
              colors={[
                "rgba(255,255,255,0.7)",
                "rgba(240,245,255,0.5)",
                "rgba(220,235,250,0.4)",
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.card}
            >
              <View style={styles.iconWrapper}>{tool.icon}</View>
              <Text style={styles.cardText}>{tool.title}</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 30,
  },
  heading: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1D3F69",
    marginBottom: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  cardWrapper: {
    width: cardSize,
    marginBottom: 22,
  },
  card: {
    borderRadius: 20,
    paddingVertical: 28,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.8,
    borderColor: "rgba(255,255,255,0.6)",
    backgroundColor: "rgba(255,255,255,0.4)",
    shadowColor: "#1D3F69",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
  },
  iconWrapper: {
    marginBottom: 12,
  },
  cardText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1D3F69",
    textAlign: "center",
  },
});
