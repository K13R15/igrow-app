import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { WebView } from "react-native-webview";

const SoilMoistureScreen = () => {
  const [soilMoisture, setSoilMoisture] = useState("Loading...");

  // Define the URL for WebView (Grafana dashboard)
  const dashboardUrl = "http://raspi.local:3000/d/fe192lni2vdhca/plant-sensors?orgId=1&viewPanel=1&fullscreen&kiosk";

  // Define the Grafana API URL to fetch data
  const apiUrl = "http://raspi.local:3000/api/datasources/proxy/1/query";

  // Function to get the current timestamp in milliseconds
  const getCurrentTime = () => Date.now();

  // Fetch real-time soil moisture data from Grafana
  useEffect(() => {
    const fetchSoilMoisture = async () => {
      try {
        const currentTime = getCurrentTime();
        const timeFrom = currentTime - 10000; // 10 seconds ago
        const timeTo = currentTime;

        const response = await fetch(apiUrl, {
          method: "POST", 
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer ", // Replace with your Grafana API key
          },
          body: JSON.stringify({
            query: `SELECT mean("moisture") FROM "sensor_data" WHERE time >= ${timeFrom}ms and time <= ${timeTo}ms GROUP BY time(10s) fill(null) ORDER BY time ASC`,
          }),
        });

        const data = await response.json();

        // Debug: Log the response to check its structure
        console.log("Grafana response data:", data);

        if (data.results[0]?.series[0]?.values.length > 0) {
          // Assuming the moisture value is in `data.results[0].series[0].values[0][1]`
          const newMoisture = data.results[0].series[0].values[0][1];
          console.log("New Moisture:", newMoisture); // Debug: Log the extracted moisture
          setSoilMoisture(newMoisture + "%");
        } else {
          setSoilMoisture("No data available");
        }
      } catch (error) {
        console.error("Error fetching soil moisture data:", error);
        setSoilMoisture("Error");
      }
    };

    fetchSoilMoisture();

    // Poll data every 10 seconds
    const interval = setInterval(fetchSoilMoisture, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Soil Moisture Dashboard</Text>
      <View style={styles.dataContainer}>
        <Text style={styles.dataLabel}>Current Soil Moisture:</Text>
        <Text style={styles.dataValue}>{soilMoisture}</Text>
      </View>
      {Platform.OS === "web" ? (
        <iframe
          src={dashboardUrl}
          style={{ width: "100%", height: "200%" }}
          title="Soil Moisture Dashboard"
        />
      ) : (
        <WebView
          source={{ uri: dashboardUrl }}
          style={styles.webview}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f2f2f2",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#8BC34A",
    marginBottom: 20,
  },
  dataContainer: {
    flexDirection: "row",
    marginVertical: 10,
  },
  dataLabel: {
    fontSize: 18,
    color: "#333",
  },
  dataValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 5,
    color: "#8BC34A",
  },
  webview: {
    marginTop: 20,
    width: "100%",
    height: "60%",
  },
});

export default SoilMoistureScreen;
