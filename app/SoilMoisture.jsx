import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Platform, Dimensions } from "react-native";
import { WebView } from "react-native-webview";

const SoilMoistureScreen = () => {
  const [soilMoisture, setSoilMoisture] = useState("Loading...");

  const dashboardUrl1 =
    "http://raspi.local:3000/d/fe192lni2vdhca/plant-sensors?orgId=1&viewPanel=1&fullscreen&kiosk";

  const dashboardUrl2 =
    "http://raspi.local:3000/d/fe192lni2vdhca/plant-sensors?orgId=1&refresh=5s&viewPanel=6&fullscreen&kiosk";

  useEffect(() => {
    const fetchSoilMoisture = async () => {
      try {
        // Simulate data fetching
        setSoilMoisture("35%");
      } catch (error) {
        console.error("Error fetching soil moisture data:", error);
        setSoilMoisture("Error");
      }
    };

    fetchSoilMoisture();

    const interval = setInterval(fetchSoilMoisture, 10000);
    return () => clearInterval(interval);
  }, []);

  const { width, height } = Dimensions.get("window");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Soil Moisture Dashboard</Text>

      

      {Platform.OS === "web" ? (
        <>
          <iframe
            src={dashboardUrl1}
            style={{ width: width, height: height / 2 - 100 }}
            title="Dashboard 1"
          />
          <iframe
            src={dashboardUrl2}
            style={{ width: width, height: height / 2 - 100 }}
            title="Dashboard 2"
          />
        </>
      ) : (
        <>
          <WebView
            source={{ uri: dashboardUrl1 }}
            style={[styles.webview, { width: width, height: height / 2 - 100 }]}
            scrollEnabled={false}
          />
          <WebView
            source={{ uri: dashboardUrl2 }}
            style={[styles.webview, { width: width, height: height / 2 - 100 }]}
            scrollEnabled={false}
          />
        </>
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
  },
});

export default SoilMoistureScreen;
