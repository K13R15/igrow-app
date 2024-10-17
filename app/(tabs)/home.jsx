import React, { useState } from "react";
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

const App = () => {
  const [lightsOn, setLightsOn] = useState(false);
  const [waterOn, setWaterOn] = useState(false);

  const handleLightsToggle = () => setLightsOn(!lightsOn);
  const handleWaterToggle = () => setWaterOn(!waterOn);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>iGROW Dashboard</Text>
        <Ionicons name="leaf" size={40} color="#4CAF50" />
      </View>

      {/* Status Overview Dashboard */}
      <Text style={styles.dashboardTitle}>Environment Overview</Text>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.statusCard}>
          <MaterialCommunityIcons
            name="temperature-celsius"
            size={30}
            color="#FF5722"
          />
          <Text style={styles.statusLabel}>Temperature</Text>
          <Text style={styles.statusValue}>24°C</Text>
        </View>

        <View style={styles.statusCard}>
          <Ionicons name="water" size={30} color="#2196F3" />
          <Text style={styles.statusLabel}>Humidity</Text>
          <Text style={styles.statusValue}>60%</Text>
        </View>

        <View style={styles.statusCard}>
          <FontAwesome5 name="seedling" size={30} color="#8BC34A" />
          <Text style={styles.statusLabel}>Soil Moisture</Text>
          <Text style={styles.statusValue}>80%</Text>
        </View>

        <View style={styles.statusCard}>
          <MaterialCommunityIcons
            name="weather-sunny"
            size={30}
            color="#FFC107"
          />
          <Text style={styles.statusLabel}>Light Intensity</Text>
          <Text style={styles.statusValue}>High</Text>
        </View>
      </ScrollView>

      {/* Control Buttons */}
      <View style={styles.controlContainer}>
        <TouchableOpacity
          style={[
            styles.controlButton,
            lightsOn && { backgroundColor: "#FFEB3B" }, // Yellow background if lights are on
          ]}
          onPress={handleLightsToggle}
        >
          <Ionicons
            name="bulb"
            size={30}
            color={lightsOn ? "#FFF" : "#FFEB3B"}
          />
          <Text style={styles.controlLabel}>
            Lights {lightsOn ? "On" : "Off"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.controlButton,
            waterOn && { backgroundColor: "#2196F3" }, // Blue background if water is on
          ]}
          onPress={handleWaterToggle}
        >
          <Ionicons
            name="water-outline"
            size={30}
            color={waterOn ? "#FFF" : "#2196F3"}
          />
          <Text style={styles.controlLabel}>
            Water {waterOn ? "On" : "Off"}
          </Text>
        </TouchableOpacity>

        {/* New Settings Button */}
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color="#6B7280" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "linear-gradient(180deg, #A3E635 0%, #059669 100%)", // Lime to green gradient
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
    color: "#065F46", // Dark green text
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
    elevation: 5, // For Android shadow
  },
  statusLabel: {
    fontSize: 18,
    color: "#6B7280", // Muted gray
    marginTop: 8,
  },
  statusValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#065F46", // Green text
    marginTop: 4,
  },
  controlContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  controlButton: {
    width: "30%",
    backgroundColor: "#FFF",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  settingsButton: {
    backgroundColor: "#FFF",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  controlLabel: {
    fontSize: 18,
    color: "#6B7280", // Muted gray
    marginTop: 8,
  },
});

export default App;
