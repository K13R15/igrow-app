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

const UVIntensityScreen = () => {
  const [uvIntensity, setUvIntensity] = useState("Loading...");

  const dashboardUrl1 =
    "http://raspi.local:3000/d/fe192lni2vdhca/plant-sensors?orgId=1&viewPanel=4&fullscreen&kiosk";

  const dashboardUrl2 =
    "http://raspi.local:3000/d/fe192lni2vdhca/plant-sensors?orgId=1&refresh=5s&from=1734269798323&to=1734291398323&viewPanel=7&fullscreen&kiosk";

  useEffect(() => {
    const fetchUvIntensity = async () => {
      try {
        // Simulate data fetching
        setUvIntensity("75.2 UV Index");
      } catch (error) {
        console.error("Error fetching UV intensity data:", error);
        setUvIntensity("Error");
      }
    };

    fetchUvIntensity();

    const interval = setInterval(fetchUvIntensity, 10000);
    return () => clearInterval(interval);
  }, []);

  const { width, height } = Dimensions.get("window");

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>UV Intensity Dashboard</Text>

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
              style={[
                styles.webview,
                { width: width, height: height / 2 - 100 },
              ]}
              scrollEnabled={false}
            />
            <WebView
              source={{ uri: dashboardUrl2 }}
              style={[
                styles.webview,
                { width: width, height: height / 2 - 100 },
              ]}
              scrollEnabled={false}
            />
          </>
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
  },
});

export default UVIntensityScreen;
