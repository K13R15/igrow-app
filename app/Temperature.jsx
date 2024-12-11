import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, StyleSheet, Platform } from "react-native";
import { WebView } from "react-native-webview";

import axios from 'axios';

// InfluxDB Config
const INFLUXDB_URL = 'http://localhost:8086';  // Replace with your InfluxDB URL
const DATABASE = 'sensor_data';

const queryInfluxDB = async () => {
  const query = 'SELECT LAST("temperature") FROM "sensor_data"';

  try {
    const response = await axios.get(`${INFLUXDB_URL}/query`, {
      params: {
        db: DATABASE,
        q: query,
      },
    });

    // Extract data
    const tempData = response.data.results[0]?.series?.[0]?.values?.[0];
    if (tempData) {
      console.log('Latest Temperature Data:', tempData);
    } else {  
      console.log('No Temperature data found');
    }
  } catch (error) {
    console.error('Error querying InfluxDB:', error);
  }
};

const TemperatureScreen = () => {
  const [temperature, setTemperature] = useState("Loading...");

  // Define the URL for WebView
  const dashboardUrl = "http://raspi.local:3000/d/fe192lni2vdhca/plant-sensors?orgId=1&viewPanel=3&fullscreen&kiosk";

  // Define the Grafana API URL
  const apiUrl = "http://raspi.local:3000/api/datasources/proxy/1/query";

  // Function to get the current timestamp in milliseconds
  const getCurrentTime = () => Date.now();

  // Fetch real-time temperature data from Grafana
  useEffect(() => {
    const fetchTemperature = async () => {
      try {
        const currentTime = getCurrentTime();
        const timeFrom = currentTime - 10000; // 10 seconds ago
        const timeTo = currentTime;

        const response = await fetch(apiUrl, {
          method: "POST",
          // mode: 'no-cors', // Disables CORS
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer ", // Replace with your Grafana API key
          },
          body: JSON.stringify({
            query: `SELECT mean("temperature") FROM "sensor_data" WHERE time >= ${timeFrom}ms and time <= ${timeTo}ms GROUP BY time(10s) fill(null) ORDER BY time ASC`,
          }),
        });

        const data = await response.json();

        
        if (data.results[0]?.series[0]?.values.length > 0) {
          // Assuming the temperature is in `data.results[0].series[0].values[0][1]`
          const newTemperature = data.results[0].series[0].values[0][1];
          setTemperature(newTemperature + "°C");
        } else {
          setTemperature("No data available");
        }
      } catch (error) {
        console.error("Error fetching temperature data:", error);
        setTemperature("Error");
      }
    };

    fetchTemperature();

    // Poll data every 10 seconds
    const interval = setInterval(fetchTemperature, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Temperature Dashboard</Text>
        <View style={styles.dataContainer}>
          <Text style={styles.dataLabel}>Current Temperature:</Text>
          <Text style={styles.dataValue}>{temperature}</Text>
        </View>
        {Platform.OS === "web" ? (
          <iframe
            src={dashboardUrl}
            style={{ width: "100%", height: 800 }}
            title="Temperature Dashboard"
          />
        ) : (
          <WebView
            source={{ uri: dashboardUrl }}
            style={styles.webview}
            scrollEnabled={true}
          />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
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
    color: "#FF5722",
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
    color: "#FF5722",
  },
  webview: {
    marginTop: 20,
    width: "100%",
    height: 800,
  },
});

export default TemperatureScreen;
