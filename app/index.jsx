import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { View, Text, Image, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "../constants";
import { CustomButton, Loader } from "../components";

const Welcome = () => {
  const [loading, setLoading] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <Loader isLoading={loading} />

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.innerContainer}>
          {/* Logo */}
          <Image
            source={images.logo} // Replace with your app's logo
            style={styles.logo}
            resizeMode="contain"
          />

          {/* Intro Text */}
          <View style={styles.introTextContainer}>
            <Text style={styles.introText}>
              Grow Smarter{"\n"}with{" "}
              <Text style={styles.highlightText}>iGROW</Text>
            </Text>
          </View>

          {/* Continue Button */}
          <CustomButton
            title="Get Started with iGROW"
            handlePress={() => router.push("/sign-in")} // Navigate to sign-in screen
            containerStyles={styles.buttonContainer}
            textStyles={styles.buttonText}
          />
        </View>
      </ScrollView>

      <StatusBar backgroundColor="#A3E635" style="light" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#A3E635", // Lime green background
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  logo: {
    width: 256, // 64 * 4 for scaling
    height: 96, // 24 * 4 for scaling
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#16A34A", // Green border
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
  },
  introTextContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  introText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#065F46", // Dark green text
    textAlign: "center",
  },
  highlightText: {
    color: "#16A34A", // Lighter green
  },
  buttonContainer: {
    width: "100%",
    marginTop: 28,
    backgroundColor: "#15803D", // Dark green
    borderRadius: 50,
    paddingVertical: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
  },
  buttonText: {
    color: "#FFF",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Welcome;
