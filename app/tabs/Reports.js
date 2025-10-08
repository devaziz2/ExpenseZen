import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { BarChart, PieChart } from "react-native-chart-kit";
import { db } from "../../firebase";

const screenWidth = Dimensions.get("window").width;

export default function ReportsScreen({ isFocused }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Use useEffect instead of useFocusEffect
  useEffect(() => {
    if (!isFocused) return; // only run when screen is focused

    const fetchUserData = async () => {
      try {
        setLoading(true);
        const storedUser = await AsyncStorage.getItem("userData");
        if (!storedUser) {
          console.log("No user data found in AsyncStorage");
          setUser(null);
          setLoading(false);
          return;
        }

        const parsedUser = JSON.parse(storedUser);
        const userDoc = await getDoc(doc(db, "users", parsedUser.id));

        if (userDoc.exists()) {
          setUser(userDoc.data());
        } else {
          console.log("User not found in Firestore");
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isFocused]);

  // ✅ Chart configuration
  const chartConfig = {
    backgroundColor: "#FFFFFF",
    backgroundGradientFrom: "#FFFFFF",
    backgroundGradientTo: "#FFFFFF",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(29, 63, 105, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    propsForBackgroundLines: {
      strokeDasharray: "", // solid background lines
    },
  };

  // ✅ Prepare PieChart data
  const overviewData = user
    ? [
        {
          name: "Balance",
          amount: user.balance ?? 0,
          color: "#4F8EDC",
          legendFontColor: "#333",
          legendFontSize: 14,
        },
        {
          name: "Savings",
          amount: user.savings ?? 0,
          color: "#6BA368",
          legendFontColor: "#333",
          legendFontSize: 14,
        },
        {
          name: "Spendings",
          amount: user.spendings ?? 0,
          color: "#E85C4A",
          legendFontColor: "#333",
          legendFontSize: 14,
        },
      ]
    : [];

  // ✅ Prepare BarChart data from budgets array
  const categoryLabels =
    user?.budgets?.length > 0
      ? user.budgets.map((b) => b.category)
      : ["No categories"];
  const categorySpends =
    user?.budgets?.length > 0 ? user.budgets.map((b) => b.spent ?? 0) : [0];

  const categoryData = {
    labels: categoryLabels.slice(0, 6), // limit to avoid crowding
    datasets: [{ data: categorySpends.slice(0, 6) }],
  };

  // ✅ Loading skeleton
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1D3F69" />
        <Text style={styles.loadingText}>Loading Reports</Text>
      </View>
    );
  }

  // ✅ If user data missing (edge case)
  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.noDataText}>No user data found.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 50 }}
    >
      {/* Header */}
      <Text style={styles.title}>Reports Overview</Text>

      {/* Pie Chart */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Current Money Overview</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 20 }}
        >
          <PieChart
            data={overviewData.map((item) => ({
              name: item.name,
              population: item.amount,
              color: item.color,
              legendFontColor: item.legendFontColor,
              legendFontSize: item.legendFontSize,
            }))}
            width={Math.max(screenWidth, overviewData.length * 120)}
            height={220}
            chartConfig={chartConfig}
            accessor={"population"}
            backgroundColor={"transparent"}
            paddingLeft={"15"}
            absolute
          />
        </ScrollView>
      </View>

      {/* Bar Chart */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Spending by Category</Text>
        {categoryData.labels.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <BarChart
              data={categoryData}
              width={Math.max(screenWidth, categoryData.labels.length * 100)}
              height={280}
              yAxisLabel="$"
              fromZero
              chartConfig={chartConfig}
              style={{ borderRadius: 12 }}
            />
          </ScrollView>
        ) : (
          <Text style={styles.noDataText}>
            No spending data available for categories.
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const chartConfig = {
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(29, 63, 105, ${opacity})`, // deep blue
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  barPercentage: 0.6,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingTop: 40,
    paddingLeft: 20,
    paddingRight: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1D3F69",
    textAlign: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1D3F69",
    marginBottom: 10,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  noDataText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    paddingVertical: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  loadingText: {
    marginTop: 10,
    color: "#1D3F69",
    fontSize: 16,
  },
});
