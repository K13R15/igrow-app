import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Platform,
  Dimensions,
} from "react-native";
import { WebView } from "react-native-webview";
import { DASHBOARD_URL1, DASHBOARD_URL2 } from "@env";

const HumidityScreen = () => {
  const [humidity, setHumidity] = useState("Loading...");

  useEffect(() => {
    const fetchHumidity = async () => {
      try {
        setHumidity("75.4%"); // Simulated data
      } catch (error) {
        console.error("Error fetching humidity data:", error);
        setHumidity("Error");
      }
    };

    fetchHumidity();

    const interval = setInterval(fetchHumidity, 10000);
    return () => clearInterval(interval);
  }, []);

  const { width, height } = Dimensions.get("window");

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Humidity Dashboard</Text>

      {Platform.OS === "web" ? (
        <iframe
          src={DASHBOARD_URL1}
          style={{ width: width, height: height / 2 - 100, border: "none" }}
          title="Dashboard 1"
        />
      ) : (
        <WebView
          source={{ uri: DASHBOARD_URL1 }}
          style={[styles.webview, { width: width, height: height / 2 - 100 }]}
          scrollEnabled={false}
        />
      )}

      {Platform.OS === "web" ? (
        <iframe
          src={DASHBOARD_URL2}
          style={{ width: width, height: height / 2 - 100, border: "none" }}
          title="Dashboard 2"
        />
      ) : (
        <WebView
          source={{ uri: DASHBOARD_URL2 }}
          style={[styles.webview, { width: width, height: height / 2 - 100 }]}
          scrollEnabled={false}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
  webview: {
    marginTop: 20,
  },
});

export default HumidityScreen;
