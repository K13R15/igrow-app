import React from "react";
import { View, Text, StyleSheet } from "react-native";

const SoilMoistureScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Soil Moisture Dashboard</Text>
      <View style={styles.dataContainer}>
        <Text style={styles.dataLabel}>Current Soil Moisture:</Text>
        <Text style={styles.dataValue}>80%</Text>
      </View>
      {/* Additional data or graphs can go here */}
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
});

export default SoilMoistureScreen;
