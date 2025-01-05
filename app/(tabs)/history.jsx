import React, { useState, useEffect } from "react";
import { Text, View, ScrollView, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { account, databases } from "../../lib/appwrite"; // Ensure this path is correct
import { Query } from "react-native-appwrite"; // Import the Query for querying documents
import { appwriteConfig } from "../../lib/appwrite"; // Make sure appwriteConfig is imported

const History = () => {
  const [logs, setLogs] = useState([]); // Combined logs for watering, soil moisture, humidity, intensity, and temperature
  const [loading, setLoading] = useState(true);

  // Fetch watering events
  const fetchWateringEvents = async (userId) => {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.wateredDateTimeId,
        [Query.equal("userId", userId)] // Query by userId
      );
      return response.documents;
    } catch (error) {
      console.error("Failed to fetch watering events:", error);
      Alert.alert("Error", "Unable to fetch watering events.");
      return [];
    }
  };

  // Fetch soil moisture events
  const fetchSoilMoistureEvents = async (userId) => {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.checkSoilMoisture,
        [Query.equal("userId", userId)]
      );
      return response.documents;
    } catch (error) {
      console.error("Failed to fetch soil moisture events:", error);
      Alert.alert("Error", "Unable to fetch soil moisture events.");
      return [];
    }
  };

  // Fetch humidity events
  const fetchHumidityEvents = async (userId) => {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.checkHumidityId,
        [Query.equal("userId", userId)]
      );
      return response.documents;
    } catch (error) {
      console.error("Failed to fetch humidity events:", error);
      Alert.alert("Error", "Unable to fetch humidity events.");
      return [];
    }
  };

  // Fetch intensity events
  const fetchIntensityEvents = async (userId) => {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.checkLightIntensityId, // Collection ID for intensity events
        [Query.equal("userId", userId)]
      );
      return response.documents;
    } catch (error) {
      console.error("Failed to fetch intensity events:", error);
      Alert.alert("Error", "Unable to fetch intensity events.");
      return [];
    }
  };

  // Fetch temperature events
  const fetchTemperatureEvents = async (userId) => {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.checkTemperatureId, // Collection ID for temperature events
        [Query.equal("userId", userId)]
      );
      return response.documents;
    } catch (error) {
      console.error("Failed to fetch temperature events:", error);
      Alert.alert("Error", "Unable to fetch temperature events.");
      return [];
    }
  };

  const getLogs = async () => {
    try {
      const session = await account.get(); // Get user session to get userId
      if (!session) {
        Alert.alert("Session expired", "Please log in again.");
        return; // Stop further processing if no session
      }
      const userId = session.$id; // Extract user ID
      const wateringEvents = await fetchWateringEvents(userId);
      const soilMoistureEvents = await fetchSoilMoistureEvents(userId);
      const humidityEvents = await fetchHumidityEvents(userId);
      const intensityEvents = await fetchIntensityEvents(userId); // Fetch intensity events
      const temperatureEvents = await fetchTemperatureEvents(userId); // Fetch temperature events

      // Merge all events
      const mergedLogs = [
        ...wateringEvents.map((log) => ({
          ...log,
          type: "watering",
          timestamp: log.wateredAt,
        })),
        ...soilMoistureEvents.map((log) => ({
          ...log,
          type: "soilMoisture",
          timestamp: log.createdAt,
        })),
        ...humidityEvents.map((log) => ({
          ...log,
          type: "humidity",
          timestamp: log.createdAt,
        })),
        ...intensityEvents.map((log) => ({
          ...log,
          type: "intensity", // Add type to differentiate the logs
          timestamp: log.createdAt,
        })),
        ...temperatureEvents.map((log) => ({
          ...log,
          type: "temperature", // Add type for temperature logs
          timestamp: log.createdAt,
        })),
      ];

      // Sort all logs by timestamp (newest first)
      const sortedLogs = mergedLogs.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );

      setLogs(sortedLogs); // Set combined and sorted logs
    } catch (error) {
      console.error("Failed to get logs:", error);
    } finally {
      setLoading(false); // Stop loading once data is fetched
    }
  };

  useEffect(() => {
    getLogs();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
        <Text style={styles.loadingSubText}>Cultivating your garden's story</Text>
      </View>
    ); // Show loading message while data is being fetched
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Activity Logs</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {logs.length === 0 ? (
          <Text style={styles.noLogs}>No events found.</Text>
        ) : (
          logs.map((log) => (
            <View key={log.$id} style={styles.logItem}>
              <MaterialCommunityIcons
                name={
                  log.type === "watering"
                    ? "water"
                    : log.type === "soilMoisture"
                    ? "water-percent"
                    : log.type === "humidity"
                    ? "cloud-outline"
                    : log.type === "intensity"
                    ? "flash"
                    : "thermometer" // Use thermometer icon for temperature
                }
                size={28}
                color={
                  log.type === "watering"
                    ? "#34D399"
                    : log.type === "soilMoisture"
                    ? "#3B82F6"
                    : log.type === "humidity"
                    ? "#A78BFA"
                    : log.type === "intensity"
                    ? "#F59E0B"
                    : "#FF6347" // Color for temperature
                }
                style={styles.icon}
              />
              <View style={styles.logDetails}>
                <Text style={styles.action}>
                  {log.type === "watering"
                    ? "Watered the garden"
                    : log.type === "soilMoisture"
                    ? "Checked Soil Moisture"
                    : log.type === "humidity"
                    ? "Checked Humidity"
                    : log.type === "intensity"
                    ? "Checked Light Intensity"
                    : "Checked Temperature"}{" "}
                  {/* Action text for temperature */}
                </Text>
                <Text style={styles.time}>
                  {new Date(log.timestamp).toLocaleString()}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginVertical: 16,
    backgroundColor: "#F0F4F8",
    flex: 1,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1F2937",
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
    color: "#374151",
  },
  time: {
    fontSize: 14,
    color: "#6B7280",
  },
  noLogs: {
    fontSize: 16,
    textAlign: "center",
    color: "#6B7280",
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F4F8",
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
    color: "#34D399",
    textAlign: "center",
  },
  loadingSubText: {
    marginTop: 10,
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
});

export default History;
