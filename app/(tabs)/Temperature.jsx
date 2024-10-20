import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import HomeScreen from "./home";

const TemperatureScreen = ({}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text>Temperature Details</Text>
      <Button
        title="Go back to Dashboard"
        onPress={() => navigation.goBack("home")}
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
