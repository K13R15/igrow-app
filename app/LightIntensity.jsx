import React from "react";
import { View, Text, StyleSheet } from "react-native";

const LightIntensityScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Light Intensity Dashboard</Text>
      <View style={styles.dataContainer}>
        <Text style={styles.dataLabel}>Current Light Intensity:</Text>
        <Text style={styles.dataValue}>High</Text>
      </View>
      {/* Additional light intensity data and charts can be placed here */}
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
});

export default LightIntensityScreen;
