import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, StyleSheet, Platform } from "react-native";
import { WebView } from "react-native-webview";

const HumidityScreen = () => {
  const [humidity, setHumidity] = useState("Loading...");

  // Define the URL for WebView (Grafana dashboard)
  const dashboardUrl = "http://raspi.local:3000/d/fe192lni2vdhca/plant-sensors?orgId=1&viewPanel=2&fullscreen&kiosk";

  // Define the Grafana API URL to fetch data
  const apiUrl = "http://raspi.local:3000/api/datasources/proxy/1/query";

  // Function to get the current timestamp in milliseconds
  const getCurrentTime = () => Date.now();

  // Fetch real-time humidity data from Grafana
  useEffect(() => {
    const fetchHumidity = async () => {
      try {
        const currentTime = getCurrentTime();
        const timeFrom = currentTime - 10000; // 10 seconds ago
        const timeTo = currentTime;

        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
<<<<<<< HEAD
            "Authorization": "Bearer sa-1-igrow-c961675c-a8f9-4201-883b-9f3ea87e1983", // Replace with your Grafana API key
=======
            "Authorization": "Bearer glsa_ypeUD6wVC1PVvqV8ORXHeVFmkx4kMofU_293241b2", // Replace with your Grafana API key
>>>>>>> 45673bd (Added Dashboard for sensors)
          },
          body: JSON.stringify({
            query: `SELECT mean("humidity") FROM "sensor_data" WHERE time >= ${timeFrom}ms and time <= ${timeTo}ms GROUP BY time(10s) fill(null) ORDER BY time ASC`,
          }),
        });

        const data = await response.json();

        // Debug: Log the response to check its structure
        console.log("Grafana response data:", data);

        if (data.results[0]?.series[0]?.values.length > 0) {
          // Assuming the humidity value is in `data.results[0].series[0].values[0][1]`
          const newHumidity = data.results[0].series[0].values[0][1];
          console.log("New Humidity:", newHumidity); // Debug: Log the extracted humidity
          setHumidity(newHumidity + "%");
        } else {
          setHumidity("No data available");
        }
      } catch (error) {
        console.error("Error fetching humidity data:", error);
        setHumidity("Error");
      }
    };

    fetchHumidity();

    // Poll data every 10 seconds
    const interval = setInterval(fetchHumidity, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Humidity Dashboard</Text>
        <View style={styles.dataContainer}>
          <Text style={styles.dataLabel}>Current Humidity:</Text>
          <Text style={styles.dataValue}>{humidity}</Text>
        </View>
        {Platform.OS === "web" ? (
          <iframe
            src={dashboardUrl}
            style={{ width: "100%", height: 800 }}
            title="Humidity Dashboard"
          />
        ) : (
          <WebView
            source={{ uri: dashboardUrl }}
            style={styles.webview}
            scrollEnabled={true}
            originWhitelist={['*']} // Allow all origins
            javaScriptEnabled={true} // Enable JavaScript
            domStorageEnabled={true} // Enable DOM storage
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
    color: "#2196F3",
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
    color: "#2196F3",
  },
  webview: {
    marginTop: 20,
    width: "100%",
    height: 800, // Adjust height as needed
  },
});

export default HumidityScreen;
