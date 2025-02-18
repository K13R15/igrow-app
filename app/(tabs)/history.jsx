import React, { useState, useEffect } from "react";
import { Text, View, ScrollView, StyleSheet, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { wsManager } from "../utils/websocket"; // Import the WebSocket manager

const History = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const [latestReadings, setLatestReadings] = useState({
    temperature: null,
    humidity: null,
    moisture: null,
    light: null,
    ph: null,
  });

  useEffect(() => {
    const handleWebSocketEvent = (type, data) => {
      switch (type) {
        case "connected":
          setConnected(true);
          setLoading(false);
          setError(null);
          break;
        case "disconnected":
          setConnected(false);
          break;
        case "error":
          setError(
            data.type === "connectionError"
              ? "Unable to connect to sensors"
              : "Error receiving sensor data"
          );
          break;
        case "maxRetriesReached":
          setError(
            "Unable to establish connection. Please check your network."
          );
          break;
        case "data":
          // Handle both regular sensor data and alerts
          if (data.type === "HIGH_MOISTURE_ALERT") {
            handleSensorData({
              type: "HIGH_MOISTURE_ALERT",
              moisture: data.moisture,
            });
          } else {
            handleSensorData(data);
          }
          updateLatestReadings(data);
          break;
      }
    };

    wsManager.addListener(handleWebSocketEvent);

    return () => {
      wsManager.removeListener(handleWebSocketEvent);
    };
  }, []);

  const updateLatestReadings = (data) => {
    setLatestReadings((prev) => ({
      temperature: data.t || prev.temperature,
      humidity: data.h || prev.humidity,
      moisture: data.m || prev.moisture,
      light: data.u || prev.light,
      ph: data.p || prev.ph,
    }));
  };

  const handleSensorData = (data) => {
    const timestamp = new Date().toISOString();
    const newLogs = [];

    // Handle regular sensor readings
    if (data.t !== undefined) {
      newLogs.push({
        $id: `${timestamp}-temp`,
        timestamp: timestamp,
        type: "temperature",
        value: data.t,
        message: `Temperature: ${data.t}°C`,
      });
    }

    if (data.h !== undefined) {
      newLogs.push({
        $id: `${timestamp}-humidity`,
        timestamp: timestamp,
        type: "humidity",
        value: data.h,
        message: `Humidity: ${data.h}%`,
      });
    }

    if (data.m !== undefined) {
      newLogs.push({
        $id: `${timestamp}-moisture`,
        timestamp: timestamp,
        type: "soilMoisture",
        value: data.m,
        message: `Soil Moisture: ${data.m}%`,
      });
    }

    if (data.u !== undefined) {
      newLogs.push({
        $id: `${timestamp}-light`,
        timestamp: timestamp,
        type: "intensity",
        value: data.u,
        message: `Light Intensity: ${data.u} mW/cm²`,
      });
    }

    if (data.p !== undefined) {
      newLogs.push({
        $id: `${timestamp}-ph`,
        timestamp: timestamp,
        type: "ph",
        value: data.p,
        message: `pH Level: ${data.p}`,
      });
    }

    // Handle high moisture alert
    if (data.type === "HIGH_MOISTURE_ALERT") {
      newLogs.push({
        $id: `${timestamp}-alert`,
        timestamp: timestamp,
        type: "soilMoisture",
        value: data.moisture,
        message: `High Moisture Alert: ${data.moisture}%`,
        isAlert: true,
      });
    }

    // Add all new logs to the existing logs
    if (newLogs.length > 0) {
      setLogs((prevLogs) => [...newLogs, ...prevLogs].slice(0, 100));
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Connecting to Sensors...</Text>
        <Text style={styles.loadingSubText}>
          Establishing real-time connection
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>
        Activity History {!connected && "(Offline)"}
      </Text>

      {error ? (
        <View style={[styles.offlineBar, styles.errorBar]}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        !connected && (
          <View style={styles.offlineBar}>
            <Text style={styles.offlineText}>Reconnecting to sensors...</Text>
          </View>
        )
      )}

      <ScrollView
        style={styles.logContainer}
        showsVerticalScrollIndicator={false}
      >
        {logs.length === 0 ? (
          <Text style={styles.noLogs}>Waiting for sensor data...</Text>
        ) : (
          logs.map((log) => (
            <View
              key={log.$id}
              style={[styles.logItem, log.isAlert && styles.alertLogItem]}
            >
              <MaterialCommunityIcons
                name={
                  log.type === "soilMoisture"
                    ? "water-percent"
                    : log.type === "humidity"
                    ? "cloud-outline"
                    : log.type === "intensity"
                    ? "white-balance-sunny"
                    : log.type === "temperature"
                    ? "thermometer"
                    : log.type === "ph"
                    ? "flask"
                    : "information"
                }
                size={28}
                color={
                  log.isAlert
                    ? "#DC2626" // Red color for alerts
                    : log.type === "soilMoisture"
                    ? "#45B7D1"
                    : log.type === "humidity"
                    ? "#4ECDC4"
                    : log.type === "intensity"
                    ? "#FFE66D"
                    : log.type === "temperature"
                    ? "#FF6B6B"
                    : log.type === "ph"
                    ? "#95A5A6"
                    : "#6B7280"
                }
                style={styles.icon}
              />
              <View style={styles.logDetails}>
                <Text style={[styles.action, log.isAlert && styles.alertText]}>
                  {log.message}
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
  offlineBar: {
    backgroundColor: "#FEF3C7",
    padding: 8,
    marginBottom: 16,
    borderRadius: 8,
  },
  offlineText: {
    color: "#92400E",
    textAlign: "center",
    fontSize: 14,
  },
  errorBar: {
    backgroundColor: "#FEE2E2",
  },
  errorText: {
    color: "#DC2626",
    textAlign: "center",
    fontSize: 14,
  },
  dashboard: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  readingCard: {
    width: "48%",
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    alignItems: "center",
  },
  readingValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    marginVertical: 4,
  },
  readingLabel: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
  },
  logContainer: {
    flex: 1,
  },
  alertLogItem: {
    backgroundColor: "#FEE2E2", // Light red background for alerts
    borderLeftWidth: 4,
    borderLeftColor: "#DC2626",
  },
  alertText: {
    color: "#DC2626", // Red text for alerts
    fontWeight: "700",
  },
});

export default History;
