import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, StyleSheet, Platform } from "react-native";
import { WebView } from "react-native-webview";

const HumidityScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Humidity Dashboard</Text>
        <View style={styles.dataContainer}>
          <Text style={styles.dataLabel}>Current Humidity:</Text>
          <Text style={styles.dataValue}>{humidity}</Text>
        </View>
        {Platform.OS === "web" ? (
          <iframe
            src={dashboardUrl}
            style={{ width: "100%", height: 800 }}
            title="Humidity Dashboard"
          />
        ) : (
          <WebView
            source={{ uri: dashboardUrl }}
            style={styles.webview}
            scrollEnabled={true}
            originWhitelist={['*']} // Allow all origins
            javaScriptEnabled={true} // Enable JavaScript
            domStorageEnabled={true} // Enable DOM storage
          />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
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
  webview: {
    marginTop: 20,
    width: "100%",
    height: 800, // Adjust height as needed
  },
});

export default HumidityScreen;
