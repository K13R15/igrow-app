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

const PhLevelScreen = () => {
  const [phLevel, setPhLevel] = useState("Loading...");

  // Update these URLs to point to your Grafana pH level dashboard panels
  const dashboardUrl1 =
    "http://raspi.local:3000/d/fe192lni2vdhca/plant-sensors?orgId=1&refresh=5s&viewPanel=9&fullscreen&kiosk";

  useEffect(() => {
    const fetchPhLevel = async () => {
      // Implement actual pH level fetching here
      setPhLevel("7.0");
    };

    fetchPhLevel();

    const interval = setInterval(fetchPhLevel, 10000);
    return () => clearInterval(interval);
  }, []);

  const { width, height } = Dimensions.get("window");

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>pH Level Dashboard</Text>

      {Platform.OS === "web" ? (
        <>
          <iframe
            src={dashboardUrl1}
            style={{ width: width, height: height / 2 - 100 }}
            title="pH Level History"
          />
        </>
      ) : (
        <>
          <WebView
            source={{ uri: dashboardUrl1 }}
            style={[styles.webview, { width: width, height: height / 2 - 100 }]}
            scrollEnabled={false}
          />
        </>
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
    color: "#9C27B0", // Purple to match the pH card color scheme
    marginBottom: 20,
  },
  dataContainer: {
    flexDirection: "row",
    marginVertical: 10,
    alignItems: "center",
  },
  dataLabel: {
    fontSize: 18,
    color: "#333",
  },
  dataValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 5,
    color: "#9C27B0",
  },
  webview: {
    marginTop: 20,
    borderRadius: 10,
    overflow: "hidden",
  },
  infoContainer: {
    width: "100%",
    padding: 15,
    backgroundColor: "white",
    borderRadius: 10,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  legendContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#F3E5F5",
    borderRadius: 8,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#9C27B0",
    marginBottom: 5,
  },
  legendText: {
    fontSize: 14,
    color: "#4A4A4A",
    marginVertical: 2,
  },
});

export default PhLevelScreen;
