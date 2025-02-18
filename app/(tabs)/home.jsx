import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { toggleWater, togglePesticide } from "../esp32Control"; // Import the toggleWater function
import {
  logWateringEvent,
  logSoilMoistureEvent,
  logHumidityEvent,
  logLightIntensityEvent,
  checkTemperatureEvent,
  logPhEvent,
  account,
} from "../../lib/appwrite"; // Import the necessary functions
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Svg, Path } from "react-native-svg";
import { WebView } from "react-native-webview";
import { Platform } from "react-native";
import AlertModal from "../../components/AlertModal";
import { wsManager } from "../utils/websocket";

// Add these constants at the top of the file, after imports
const MOISTURE_THRESHOLDS = {
  ALERT: 75, // Alert threshold
  SAFE: 70, // Safe operating threshold
  HIGH: 85, // High moisture warning
  VERY_HIGH: 90, // Critical moisture level
};

// SVG background pattern
const LeafPattern = () => (
  <Svg
    height="100%"
    width="100%"
    viewBox="0 0 100 100"
    style={StyleSheet.absoluteFillObject}
  >
    <Path
      d="M20,50 Q30,60 50,50 T80,50"
      fill="none"
      stroke="rgba(255,255,255,0.1)"
      strokeWidth="2"
    />
    <Path
      d="M30,30 Q40,40 60,30 T90,30"
      fill="none"
      stroke="rgba(255,255,255,0.1)"
      strokeWidth="2"
    />
    <Path
      d="M10,70 Q20,80 40,70 T70,70"
      fill="none"
      stroke="rgba(255,255,255,0.1)"
      strokeWidth="2"
    />
  </Svg>
);

function HomeScreen() {
  const navigation = useNavigation();
  const [waterOn, setWaterOn] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [intensityLevel, setIntensityLevel] = useState("High"); // Default value as a placeholder
  const [phLevel, setPhLevel] = useState(null);
  const [pesticideOn, setPesticideOn] = useState(false);
  const [moistureLevel, setMoistureLevel] = useState(0); // Add this state for tracking moisture level
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "",
    message: "",
    type: "warning",
  });

  const webViewSource = {
    uri: "http://raspi.local:3000/d/fe192lni2vdhca/plant-sensors?orgId=1&refresh=5s&viewPanel=3&fullscreen&kiosk",
  };

  const webViewSource1 = {
    uri: "http://raspi.local:3000/d/fe192lni2vdhca/plant-sensors?orgId=1&viewPanel=1&fullscreen&kiosk",
  };

  const webViewSource2 = {
    uri: "http://raspi.local:3000/d/fe192lni2vdhca/plant-sensors?orgId=1&refresh=5s&from=1734141181665&to=1734162781665&viewPanel=2&fullscreen&kiosk",
  };

  const webViewSource3 = {
    uri: "http://raspi.local:3000/d/fe192lni2vdhca/plant-sensors?orgId=1&refresh=5s&viewPanel=9&fullscreen&kiosk",
  };

  const webViewSource4 = {
    uri: "http://raspi.local:3000/d/fe192lni2vdhca/plant-sensors?orgId=1&viewPanel=4&fullscreen&kiosk",
  };

  const handleCheckTemperature = async () => {
    if (!isUserLoggedIn) {
      Alert.alert(
        "Login Required",
        "You need to be logged in to check Temperature."
      );
      return;
    }

    try {
      await checkTemperatureEvent(); // Pass intensity level to log the event
      Alert.alert("Success", "Light intensity event logged.");
    } catch (error) {
      console.error("Failed to log light intensity event:", error.message);
      Alert.alert("Error", "Failed to check Temperature event.");
    }
  };

  // Function to fetch light intensity (simulating fetching from an API)
  const fetchLightIntensity = async () => {
    // Placeholder for light intensity logic (can replace with an API call)
    const fetchedIntensity = "High"; // Replace with actual fetch logic
    setIntensityLevel(fetchedIntensity);
  };

  useEffect(() => {
    fetchLightIntensity(); // Fetch light intensity on component mount
  }, []);

  // Handle light intensity logging
  const handleLogLightIntensity = async () => {
    if (!isUserLoggedIn) {
      Alert.alert(
        "Login Required",
        "You need to be logged in to log light intensity."
      );
      return;
    }

    try {
      await logLightIntensityEvent(intensityLevel); // Pass intensity level to log the event
      Alert.alert("Success", "Check Temperature event logged.");
    } catch (error) {
      console.error("Failed to log light intensity event:", error.message);
      Alert.alert("Error", "Failed to log light intensity event.");
    }
  };

  // Check user session and login status
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        await account.get(); // Check if the user is logged in
        setIsUserLoggedIn(true);
      } catch (error) {
        console.error("No active session found:", error.message);
        setIsUserLoggedIn(false);
        Alert.alert("Session Error", "Please log in to continue.");
      }
    };

    checkUserSession();
  }, []);

  // Handle humidity logging
  const handleLogHumidity = async () => {
    if (!isUserLoggedIn) {
      Alert.alert(
        "Login Required",
        "You need to be logged in to log humidity."
      );
      return;
    }

    try {
      await logHumidityEvent(); // Call the logHumidityEvent function
      Alert.alert("Success", "Humidity event logged.");
    } catch (error) {
      console.error("Failed to log humidity event:", error.message);
      Alert.alert("Error", "Failed to log humidity event.");
    }
  };

  // Modify fetchMoistureLevel to handle errors better
  const fetchMoistureLevel = async () => {
    try {
      const response = await fetch("http://192.168.50.19/moisture", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data && typeof data.moisture === "number") {
        console.log("Updated moisture level:", data.moisture);
        setMoistureLevel(data.moisture);
      } else {
        console.error("Invalid moisture data format:", data);
      }
    } catch (error) {
      console.error("Failed to fetch moisture level:", error);
      // Don't update state if there's an error
    }
  };

  // Add this helper function
  const showModal = (title, message, type = "warning") => {
    setModalConfig({ title, message, type });
    setModalVisible(true);
  };

  // Modify handleWaterToggle
  const handleWaterToggle = async () => {
    if (!isUserLoggedIn) {
      showModal(
        "Login Required",
        "You need to be logged in to toggle water.",
        "error"
      );
      return;
    }

    try {
      setIsLoading(true);

      console.log("Current moisture level:", moistureLevel);
      console.log("Current water state:", waterOn);

      if (moistureLevel >= 75) {
        setIsLoading(false);
        showModal(
          "Moisture Level Too High",
          `Cannot activate watering system: Soil moisture is currently at ${moistureLevel}%. The system prevents overwatering when moisture levels exceed 75%.`,
          "warning"
        );
        return;
      }

      console.log("Attempting to toggle water...");
      await toggleWater(waterOn, setWaterOn);
      console.log("Water toggle successful");

      await logWateringEvent();
      showModal(
        "Success",
        `Watering system has been ${waterOn ? "deactivated" : "activated"}.`,
        "success"
      );
    } catch (error) {
      console.error("Water toggle error:", {
        message: error.message,
        stack: error.stack,
        type: error.name,
      });

      if (error.message.includes("timed out")) {
        showModal(
          "Connection Timeout",
          "Unable to reach the water control system. Please check your connection and try again.",
          "error"
        );
      } else if (error.message.includes("Network request failed")) {
        showModal(
          "Network Error",
          "Cannot connect to the water control system. Please check if the device is online.",
          "error"
        );
      } else if (error.message.includes("cancelled")) {
        showModal(
          "Request Cancelled",
          "The water control request was cancelled. Please try again.",
          "error"
        );
      } else {
        showModal(
          "Error",
          `Failed to toggle water system: ${error.message}`,
          "error"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle soil moisture logging
  const handleLogSoilMoisture = async () => {
    if (!isUserLoggedIn) {
      Alert.alert(
        "Login Required",
        "You need to be logged in to log soil moisture."
      );
      return;
    }

    try {
      await logSoilMoistureEvent(); // Log the event with current date and time
      Alert.alert("Success", "Soil moisture event logged.");
    } catch (error) {
      console.error("Failed to log soil moisture event:", error.message);
      Alert.alert("Error", "Failed to log soil moisture event.");
    }
  };

  const handleCheckPh = async () => {
    if (!isUserLoggedIn) {
      Alert.alert(
        "Login Required",
        "You need to be logged in to check pH level."
      );
      return;
    }

    try {
      await logPhEvent();
      Alert.alert("Success", "pH level event logged.");
    } catch (error) {
      console.error("Failed to log pH event:", error.message);
      Alert.alert("Error", "Failed to check pH level.");
    }
  };

  // Modify handlePesticideToggle
  const handlePesticideToggle = async () => {
    if (!isUserLoggedIn) {
      showModal(
        "Login Required",
        "You need to be logged in to toggle pesticide.",
        "error"
      );
      return;
    }

    try {
      setIsLoading(true);

      // Use the current moisture level from state instead of fetching again
      if (moistureLevel >= 75) {
        setIsLoading(false);
        showModal(
          "Moisture Level Too High",
          `Cannot apply pesticide: Soil moisture is currently at ${moistureLevel}%. The system prevents pesticide application when moisture levels exceed 75%.`,
          "warning"
        );
        return;
      }

      await togglePesticide(pesticideOn, setPesticideOn);
      showModal(
        "Success",
        `Pesticide system has been ${
          pesticideOn ? "deactivated" : "activated"
        }.`,
        "success"
      );
    } catch (error) {
      console.error("Pesticide toggle error:", {
        message: error.message,
        stack: error.stack,
        type: error.name,
      });

      if (error.message.includes("already")) {
        showModal(
          "Information",
          `Pesticide system is ${pesticideOn ? "already on" : "already off"}.`,
          "info"
        );
      } else if (error.message.includes("timed out")) {
        showModal(
          "Connection Timeout",
          "Unable to reach the pesticide control system. Please check your connection and try again.",
          "error"
        );
      } else if (error.message.includes("Network request failed")) {
        showModal(
          "Network Error",
          "Cannot connect to the pesticide control system. Please check if the device is online.",
          "error"
        );
      } else {
        showModal(
          "Error",
          `Failed to toggle pesticide system: ${error.message}`,
          "error"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Keep the useEffect for moisture level polling
  useEffect(() => {
    fetchMoistureLevel(); // Initial fetch
    const interval = setInterval(fetchMoistureLevel, 5000); // Update every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // Add this useEffect for WebSocket handling
  useEffect(() => {
    const handleWebSocketMessage = (type, data) => {
      if (type === "highMoisture") {
        const severity =
          data >= MOISTURE_THRESHOLDS.VERY_HIGH ? "error" : "warning";
        showModal(
          severity === "error"
            ? "Critical Moisture Alert"
            : "High Moisture Alert",
          `High moisture level detected (${data}%)!\n\n` +
            "This could indicate:\n" +
            "• Overwatering\n" +
            "• Poor drainage\n" +
            "• Water leak\n" +
            "• Recent rainfall\n\n" +
            "Please check your plants and irrigation system immediately.",
          severity
        );
      }
    };

    wsManager.addListener(handleWebSocketMessage);

    // Cleanup on component unmount
    return () => {
      wsManager.removeListener(handleWebSocketMessage);
    };
  }, []);

  // Update the checkMoistureLevel function
  const checkMoistureLevel = async () => {
    try {
      const response = await fetch("http://192.168.50.19/moisture");
      const data = await response.json();

      // Update moisture level state
      if (data && typeof data.moisture === "number") {
        setMoistureLevel(data.moisture);
      }

      if (data.moisture >= MOISTURE_THRESHOLDS.ALERT) {
        let severity = "warning";
        let message = `Current soil moisture (${data.moisture}%) is above safe levels.\n\n`;

        if (data.moisture >= MOISTURE_THRESHOLDS.VERY_HIGH) {
          severity = "error";
          message += "CRITICAL MOISTURE LEVEL!\n\n";
        }

        message +=
          "Recommended actions:\n" +
          "• Stop watering immediately\n" +
          "• Check for proper drainage\n" +
          "• Monitor for plant stress\n" +
          "• Allow soil to dry\n" +
          "• Check for water leaks";

        showModal(
          data.moisture >= MOISTURE_THRESHOLDS.VERY_HIGH
            ? "Critical Moisture Warning"
            : "High Moisture Warning",
          message,
          severity
        );
      }
    } catch (error) {
      console.error("Failed to check moisture:", error);
      showModal(
        "Error",
        "Failed to check moisture levels. Please check your connection.",
        "error"
      );
    }
  };

  // Add periodic moisture check
  useEffect(() => {
    // Initial check
    checkMoistureLevel();

    // Set up interval for periodic checks
    const interval = setInterval(checkMoistureLevel, 60000); // Check every minute

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, []); // Empty dependency array means this runs once on mount

  return (
    <ImageBackground
      source={{ uri: "/placeholder.svg?height=1080&width=1920" }}
      style={styles.container}
    >
      <LeafPattern />
      <LinearGradient
        colors={["rgba(255, 255, 255, 0.9)", "rgba(255, 255, 255, 1)"]}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerText}>iGROW Dashboard</Text>
        </View>
        <Text style={styles.dashboardTitle}>Environment Overview</Text>

        <ScrollView contentContainerStyle={styles.scrollView}>
          {/* Environment Status Cards */}
          {Platform.OS === "web" ? (
            <iframe src={webViewSource.uri} style={styles.webFrame} />
          ) : (
            <Webview
              source={webViewSource}
              style={styles.webView}
              javaScriptEnabled={true}
              scalesPageToFit={false}
            />
          )}
          {Platform.OS === "web" ? (
            <iframe src={webViewSource1.uri} style={styles.webFrame} />
          ) : (
            <Webview source={webViewSource1} style={styles.webView} />
          )}
          {Platform.OS === "web" ? (
            <iframe src={webViewSource2.uri} style={styles.webFrame} />
          ) : (
            <Webview source={webViewSource2} style={styles.webView} />
          )}
          {Platform.OS === "web" ? (
            <iframe src={webViewSource3.uri} style={styles.webFrame} />
          ) : (
            <Webview source={webViewSource3} style={styles.webView} />
          )}
          {Platform.OS === "web" ? (
            <iframe
              src={webViewSource4.uri}
              style={styles.webFrameLightIntensity}
            />
          ) : (
            <Webview source={webViewSource4} style={styles.webView} />
          )}
        </ScrollView>

        {/* Water Control Button */}
        <View style={styles.controlContainer}>
          <TouchableOpacity
            style={[
              styles.controlButton,
              waterOn && { backgroundColor: "#2196F3" },
              isLoading && { opacity: 0.7 },
            ]}
            onPress={handleWaterToggle}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={waterOn ? "#FFFFFF" : "#2196F3"} />
            ) : (
              <>
                <Ionicons
                  name={waterOn ? "water" : "water-outline"}
                  size={32}
                  color={waterOn ? "#FFFFFF" : "#2196F3"}
                />
                <Text style={styles.controlLabel}>
                  Water {waterOn ? "On" : "Off"}
                </Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.controlButton,
              pesticideOn && { backgroundColor: "#4CAF50" },
              isLoading && { opacity: 0.7 },
            ]}
            onPress={handlePesticideToggle}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={pesticideOn ? "#FFFFFF" : "#4CAF50"} />
            ) : (
              <>
                <MaterialCommunityIcons
                  name={pesticideOn ? "spray" : "spray-bottle"}
                  size={32}
                  color={pesticideOn ? "#FFFFFF" : "#4CAF50"}
                />
                <Text style={styles.controlLabel}>
                  Pesticide {pesticideOn ? "On" : "Off"}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <AlertModal
        visible={modalVisible}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        onClose={() => setModalVisible(false)}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: "flex-start",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 12,
    marginBottom: 8,
  },
  headerText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#A4D79E",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  dashboardTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#A4D79E",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  scrollView: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between", // Changed to space-between
    paddingHorizontal: 4,
    gap: 12,
  },
  statusCard: {
    width: Dimensions.get("window").width * 0.45,
    padding: 16,
    borderRadius: 20,
    alignItems: "center",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  statusLabel: {
    fontSize: 18,
    color: "#4A5568",
    marginTop: 8,
    fontWeight: "600",
  },
  statusValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2D3748",
    marginTop: 4,
  },
  controlContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 4,
    marginTop: 8,
    marginBottom: 16,
  },
  controlButton: {
    width: "47%", // Match the width of dashboard items
    height: 70, // Slightly smaller height
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  controlLabel: {
    fontSize: 16,
    color: "#4A5568",
    marginTop: 6,
    fontWeight: "500",
  },
  webView: {
    flex: 1, // Fill the available space
    width: "100%", // Full width of the container
    height: "100%", // Full height of the container
    borderRadius: 20, // Optional: rounded corners
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    overflow: "hidden",
  },

  webFrame: {
    width: "17%", // Slightly smaller width
    height: 220, // Reduced height
    borderRadius: 16,
    marginBottom: 16, // Add bottom margin
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  webFrameLightIntensity: {
    width: "17%", // Slightly smaller full width
    height: 220,
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default HomeScreen;
