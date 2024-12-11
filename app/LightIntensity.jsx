import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, StyleSheet, Platform } from "react-native";
import { WebView } from "react-native-webview";

const UVIntensityScreen = () => {
  const [uvIntensity, setUvIntensity] = useState("Loading...");

  // Define the URL for the Grafana dashboard
  const dashboardUrl = "http://raspi.local:3000/d/fe192lni2vdhca/plant-sensors?orgId=1&viewPanel=4&fullscreen&kiosk";

  // Define the Grafana API URL to fetch data
  const apiUrl = "http://raspi.local:3000/api/datasources/proxy/1/query";

  // Function to get the current timestamp in milliseconds
  const getCurrentTime = () => Date.now();

  // Fetch real-time UV intensity data from Grafana
  useEffect(() => {
    const fetchUvIntensity = async () => {
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
            query: `SELECT mean("uv_intensity") FROM "sensor_data" WHERE time >= ${timeFrom}ms and time <= ${timeTo}ms GROUP BY time(10s) fill(null) ORDER BY time ASC`,
          }),
        });

        const data = await response.json();

        // Debug: Log the response to check its structure
        console.log("Grafana response data:", data);

        if (data.results[0]?.series[0]?.values.length > 0) {
          // Assuming the UV intensity value is in `data.results[0].series[0].values[0][1]`
          const newUvIntensity = data.results[0].series[0].values[0][1];
          console.log("New UV Intensity:", newUvIntensity); // Debug: Log the extracted UV intensity
          setUvIntensity(newUvIntensity); // Update the state with the new UV intensity
        } else {
          setUvIntensity("No data available");
        }
      } catch (error) {
        console.error("Error fetching UV intensity data:", error);
        setUvIntensity("Error");
      }
    };

    fetchUvIntensity();

    // Poll data every 10 seconds
    const interval = setInterval(fetchUvIntensity, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>UV Intensity Dashboard</Text>
        <View style={styles.dataContainer}>
          <Text style={styles.dataLabel}>Current UV Intensity:</Text>
          <Text style={styles.dataValue}>{uvIntensity}</Text>
        </View>
        {Platform.OS === "web" ? (
          <iframe
            src={dashboardUrl}
            style={{ width: "100%", height: 800 }}
            title="UV Intensity Dashboard"
          />
        ) : (
          <WebView
            source={{ uri: dashboardUrl }}
            style={styles.webview}
            scrollEnabled={true} // Enable scrolling in the WebView
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
    color: "#FFC107",
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
    color: "#FFC107",
  },
  webview: {
    marginTop: 20,
    width: '100%',
    height: 800, // Adjust height as needed
  },
});

export default UVIntensityScreen;
