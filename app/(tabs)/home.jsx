import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { toggleWater } from "../esp32Control"; // Import the toggleWater function from esp32Control.js
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";

function HomeScreen() {
  const navigation = useNavigation();
  const [waterOn, setWaterOn] = useState(false);

  // Function to toggle water on/off
  const handleWaterToggle = async () => {
    try {
      await toggleWater(waterOn, setWaterOn); // Use the imported toggleWater function
    } catch (error) {
      console.error("Failed to toggle water:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>iGROW Dashboard</Text>
        <Ionicons name="leaf" size={40} color="#4CAF50" />
      </View>

      <Text style={styles.dashboardTitle}>Environment Overview</Text>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <TouchableOpacity onPress={() => navigation.navigate("Temperature")}>
          <View style={styles.statusCard}>
            <MaterialCommunityIcons
              name="temperature-celsius"
              size={30}
              color="#FF5722"
            />
            <Text style={styles.statusLabel}>Temperature</Text>
            <Text style={styles.statusValue}>24°C</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Humidity")}>
          <View style={styles.statusCard}>
            <Ionicons name="water" size={30} color="#2196F3" />
            <Text style={styles.statusLabel}>Humidity</Text>
            <Text style={styles.statusValue}>60%</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("SoilMoisture")}>
          <View style={styles.statusCard}>
            <FontAwesome5 name="seedling" size={30} color="#8BC34A" />
            <Text style={styles.statusLabel}>Soil Moisture</Text>
            <Text style={styles.statusValue}>80%</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("LightIntensity")}>
          <View style={styles.statusCard}>
            <MaterialCommunityIcons
              name="weather-sunny"
              size={30}
              color="#FFC107"
            />
            <Text style={styles.statusLabel}>Light Intensity</Text>
            <Text style={styles.statusValue}>High</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.controlContainer}>
        <TouchableOpacity
          style={[
            styles.controlButton,
            waterOn && { backgroundColor: "#2196F3" }, // Blue background when water is on
          ]}
          onPress={handleWaterToggle} // Toggle water on/off when clicked
        >
          <Ionicons
            name="water-outline"
            size={30}
            color={waterOn ? "#FFF" : "#2196F3"} // White color when water is on, blue when off
          />
          <Text style={styles.controlLabel}>
            Water {waterOn ? "On" : "Off"} {/* Change text based on state */}
          </Text>
        </TouchableOpacity>

        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#A3E635",
    paddingHorizontal: 20,
    paddingVertical: 16,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 20,
  },
  headerText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#065F46",
  },
  dashboardTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#065F46",
    textAlign: "center",
  },
  scrollView: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  statusCard: {
    width: Dimensions.get("window").width * 0.45,
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  statusLabel: {
    fontSize: 18,
    color: "#6B7280",
    marginTop: 8,
  },
  statusValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#065F46",
    marginTop: 4,
  },
  controlContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  controlButton: {
    width: "40%",
    backgroundColor: "#FFF",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  controlLabel: {
    fontSize: 18,
    color: "#6B7280",
    marginTop: 8,
  },
});

export default HomeScreen;
