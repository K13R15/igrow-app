import { Text, View, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const activityLogs = [
  { id: 1, icon: "water", action: "Watered the garden", time: "10:00 AM" },
  {
    id: 2,
    icon: "weather-sunny",
    action: "Adjusted light levels",
    time: "12:00 PM",
  },
  {
    id: 3,
    icon: "thermometer",
    action: "Monitored temperature",
    time: "2:30 PM",
  },
  { id: 4, icon: "leaf", action: "Checked soil moisture", time: "4:15 PM" },
  // Add more logs as needed
];

const History = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Activity Logs</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {activityLogs.map((log) => (
          <View key={log.id} style={styles.logItem}>
            <MaterialCommunityIcons
              name={log.icon}
              size={28}
              color="#34D399" // Soft green color for the icons
              style={styles.icon}
            />
            <View style={styles.logDetails}>
              <Text style={styles.action}>{log.action}</Text>
              <Text style={styles.time}>{log.time}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginVertical: 16,
    backgroundColor: "linear-gradient(180deg, limegreen 0%, green 100%)",
    flex: 1,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1F2937", // Dark text color
    marginBottom: 24,
  },
  logItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  icon: {
    marginRight: 16,
  },
  logDetails: {
    flex: 1,
  },
  action: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151", // Darker gray for text
  },
  time: {
    fontSize: 14,
    color: "#6B7280", // Lighter gray for time
  },
});

export default History;
