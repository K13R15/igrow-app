import React, { useState, useEffect } from "react";
import { Text, View, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);

  // Add new notification
  const addNotification = (icon, message) => {
    const time = new Date().toLocaleTimeString();
    const id = notifications.length + 1;
    setNotifications((prev) => [{ id, icon, message, time }, ...prev]);
  };

  // Fetch Grafana Alerts
  const fetchGrafanaAlerts = async () => {
    try {
      const response = await fetch("http://raspi.local:3000/api/alerts", {
        method: "GET",
        headers: {
          Authorization: `Bearer sa-1-igrow-c961675c-a8f9-4201-883b-9f3ea87e1983`,
        },
      });
      const alerts = await response.json();

      alerts.forEach((alert) => {
        if (alert.state === "alerting") {
          addNotification(
            "alert-circle",
            `Alert: ${alert.name} is in alerting state!`
          );
        }
      });
    } catch (error) {
      console.error("Error fetching Grafana alerts:", error);
    }
  };

  // Poll for alerts every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchGrafanaAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Notifications</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        {notifications.map((notification) => (
          <View key={notification.id} style={styles.notificationItem}>
            <MaterialCommunityIcons
              name={notification.icon}
              size={28}
              color="#34D399"
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
    backgroundColor: "#f0f0f0",
    flex: 1,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1F2937",
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
    color: "#374151",
  },
  time: {
    fontSize: 14,
    color: "#6B7280",
  },
});

export default Notification;
