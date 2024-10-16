import { Text, View, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const notifications = [
  {
    id: 1,
    icon: "water-pump",
    message: "Watering system activated",
    time: "10:00 AM",
  },
  {
    id: 2,
    icon: "weather-sunny",
    message: "Light intensity adjusted to 70%",
    time: "12:30 PM",
  },
  {
    id: 3,
    icon: "thermometer",
    message: "Temperature reached 25°C",
    time: "2:00 PM",
  },
  {
    id: 4,
    icon: "leaf",
    message: "Soil moisture is optimal",
    time: "4:15 PM",
  },
  // Add more notifications as needed
];

const Notification = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Notifications</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {notifications.map((notification) => (
          <View key={notification.id} style={styles.notificationItem}>
            <MaterialCommunityIcons
              name={notification.icon}
              size={28}
              color="#34D399" // Soft green color for the icons
              style={styles.icon}
            />
            <View style={styles.notificationDetails}>
              <Text style={styles.message}>{notification.message}</Text>
              <Text style={styles.time}>{notification.time}</Text>
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
    paddingVertical: 24,
    backgroundColor: "linear-gradient(180deg, limegreen 0%, green 100%)",
    flex: 1,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1F2937", // Dark text color
    marginBottom: 24,
  },
  notificationItem: {
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
  notificationDetails: {
    flex: 1,
  },
  message: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151", // Darker gray for text
  },
  time: {
    fontSize: 14,
    color: "#6B7280", // Lighter gray for time
  },
});

export default Notification;