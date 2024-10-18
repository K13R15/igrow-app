import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const TemperatureScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>Temperature Details</Text>
      <Button
        title="Go back to Dashboard"
        onPress={() => navigation.goBack()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default TemperatureScreen;
