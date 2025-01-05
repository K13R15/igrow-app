import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { toggleWater } from "../esp32Control"; // Import the toggleWater function
import {
  logWateringEvent,
  logSoilMoistureEvent,
  logHumidityEvent,
  logLightIntensityEvent,
  checkTemperatureEvent,
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
} from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Svg, Path } from "react-native-svg";

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

  // Handle water toggle action
  const handleWaterToggle = async () => {
    if (!isUserLoggedIn) {
      Alert.alert(
        "Login Required",
        "You need to be logged in to toggle water."
      );
      return;
    }

    try {
      await toggleWater(waterOn, setWaterOn); // Use toggleWater from esp32Control
      console.log("Water toggled:", !waterOn);

      // Log the watering event in Appwrite
      await logWateringEvent();
      Alert.alert("Success", "Watering event logged.");
    } catch (error) {
      console.error("Failed to toggle water or log event:", error.message);
      Alert.alert("Error", "Failed to log watering event.");
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

  return (
    <ImageBackground
      source={{ uri: "/placeholder.svg?height=1080&width=1920" }}
      style={styles.container}
    >
      <LeafPattern />
      <LinearGradient
        colors={["rgba(163, 230, 53, 0.8)", "rgba(6, 95, 70, 0.8)"]}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerText}>iGROW Dashboard</Text>
          <Ionicons name="leaf" size={40} color="#FFFFFF" />
        </View>

        <Text style={styles.dashboardTitle}>Environment Overview</Text>

        <ScrollView contentContainerStyle={styles.scrollView}>
          {/* Environment Status Cards */}
          <TouchableOpacity
            onPress={() => {
              handleCheckTemperature(); // Log soil moisture
              navigation.navigate("Temperature"); // Navigate to SoilMoisture screen
            }}
          >
            <LinearGradient
              colors={["#FFE4B5", "#FFA07A"]}
              style={styles.statusCard}
            >
              <MaterialCommunityIcons
                name="temperature-celsius"
                size={30}
                color="#FF5722"
              />
              <Text style={styles.statusLabel}>Temperature</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              handleLogHumidity(); // Log humidity
              navigation.navigate("Humidity"); // Navigate to Humidity screen
            }}
          >
            <LinearGradient
              colors={["#E0F7FA", "#B2EBF2"]}
              style={styles.statusCard}
            >
              <Ionicons name="water" size={30} color="#2196F3" />
              <Text style={styles.statusLabel}>Humidity</Text>

              {/* Display the actual humidity value here */}
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              handleLogSoilMoisture(); // Log soil moisture
              navigation.navigate("SoilMoisture"); // Navigate to SoilMoisture screen
            }}
          >
            <LinearGradient
              colors={["#E8F5E9", "#C8E6C9"]}
              style={styles.statusCard}
            >
              <FontAwesome5 name="seedling" size={30} color="#4CAF50" />
              <Text style={styles.statusLabel}>Soil Moisture</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              handleLogLightIntensity(); // Log light intensity
              navigation.navigate("LightIntensity"); // Navigate to LightIntensity screen
            }}
          >
            <LinearGradient
              colors={["#FFF9C4", "#FFF59D"]}
              style={styles.statusCard}
            >
              <MaterialCommunityIcons
                name="weather-sunny"
                size={30}
                color="#FFC107"
              />
              <Text style={styles.statusLabel}>Light Intensity</Text>

              {/* Display intensity value */}
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>

        {/* Water Control Button */}
        <View style={styles.controlContainer}>
          <TouchableOpacity
            style={[
              styles.controlButton,
              waterOn && { backgroundColor: "#2196F3" }, // Blue background when water is on
            ]}
            onPress={handleWaterToggle} // Toggle water on/off when clicked
          >
            <Ionicons
              name={waterOn ? "water" : "water-outline"}
              size={32}
              color={waterOn ? "#FFFFFF" : "#2196F3"}
            />
            <Text style={styles.controlLabel}>
              Water {waterOn ? "On" : "Off"} {/* Change text based on state */}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 5,
    paddingBottom: 5,
  },
  headerText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  dashboardTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#FFFFFF",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  scrollView: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
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
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  controlButton: {
    width: "40%",
    height: 80,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    overflow: "hidden",
  },
  controlLabel: {
    fontSize: 18,
    color: "#4A5568",
    marginTop: 8,
    fontWeight: "600",
  },
});

export default HomeScreen;
