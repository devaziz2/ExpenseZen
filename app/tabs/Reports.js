import { useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { BarChart, PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export default function ReportsScreen() {
  const [overviewData] = useState([
    {
      name: "Current Balance",
      amount: 1500,
      color: "#4F8EDC", // soft blue
      legendFontColor: "#333",
      legendFontSize: 14,
    },
    {
      name: "Savings",
      amount: 800,
      color: "#6BA368", // olive green
      legendFontColor: "#333",
      legendFontSize: 14,
    },
    {
      name: "Expenses",
      amount: 1200,
      color: "#E85C4A", // soft red
      legendFontColor: "#333",
      legendFontSize: 14,
    },
  ]);

  // Example: this should come dynamically from Firebase later
  const [categoryDataRaw] = useState({
    labels: ["Food", "Rent", "Clothes", "Transport", "Shopping"], // 👈 more than 4
    datasets: [
      {
        data: [500, 700, 300, 400, 200],
      },
    ],
  });

  // ✅ Limit to max 4 categories and handle empty case
  const categoryData =
    categoryDataRaw.labels.length > 0
      ? {
          labels: categoryDataRaw.labels.slice(0, 4),
          datasets: [{ data: categoryDataRaw.datasets[0].data.slice(0, 4) }],
        }
      : null;

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
          showsHorizontalScrollIndicator={true}
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
        {categoryData ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <BarChart
              data={categoryData}
              width={Math.max(screenWidth, categoryData.labels.length * 80)}
              height={280}
              yAxisLabel="$"
              fromZero
              chartConfig={chartConfig}
              style={{ borderRadius: 12 }}
            />
          </ScrollView>
        ) : (
          <Text style={styles.noDataText}>No spending data available</Text>
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
});
