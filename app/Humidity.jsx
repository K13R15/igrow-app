import React from "react";
import { View, Text, StyleSheet } from "react-native";

const HumidityScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Humidity Dashboard</Text>
      <View style={styles.dataContainer}>
        <Text style={styles.dataLabel}>Current Humidity:</Text>
        <Text style={styles.dataValue}>60%</Text>
      </View>
      {/* You can add additional elements such as graphs, historical data, etc. */}
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
    color: "#2196F3",
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
    color: "#2196F3",
  },
});

export default HumidityScreen;
