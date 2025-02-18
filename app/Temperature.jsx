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

const TemperatureScreen = () => {
  const [temperature, setTemperature] = useState("Loading...");

  const dashboardUrl1 =
    "http://raspi.local:3000/d/fe192lni2vdhca/plant-sensors?orgId=1&refresh=5s&viewPanel=3&fullscreen&kiosk";

  const dashboardUrl2 =
    "http://raspi.local:3000/d/fe192lni2vdhca/plant-sensors?orgId=1&refresh=5s&from=1734488606062&to=1734510206062&viewPanel=5&fullscreen&kiosk";

  
  const { width, height } = Dimensions.get("window");

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Temperature Dashboard</Text>

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
  },
});

export default TemperatureScreen;
