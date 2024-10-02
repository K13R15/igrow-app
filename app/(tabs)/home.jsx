import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

export default function App() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>iGROW</Text>
        <Ionicons name="leaf" size={40} color="#4CAF50" />
      </View>

      {/* Status Overview */}
      <ScrollView contentContainerStyle={styles.statusContainer}>
        <View style={styles.statusCard}>
          <MaterialCommunityIcons name="temperature-celsius" size={30} color="#FF5722" />
          <Text style={styles.statusText}>Temperature</Text>
          <Text style={styles.statusValue}>24°C</Text>
        </View>
        <View style={styles.statusCard}>
          <Ionicons name="water" size={30} color="#2196F3" />
          <Text style={styles.statusText}>Humidity</Text>
          <Text style={styles.statusValue}>60%</Text>
        </View>
        <View style={styles.statusCard}>
          <FontAwesome5 name="seedling" size={30} color="#8BC34A" />
          <Text style={styles.statusText}>Soil Moisture</Text>
          <Text style={styles.statusValue}>80%</Text>
        </View>
        <View style={styles.statusCard}>
          <MaterialCommunityIcons name="weather-sunny" size={30} color="#FFC107" />
          <Text style={styles.statusText}>Light Intensity</Text>
          <Text style={styles.statusValue}>High</Text>
        </View>
      </ScrollView>

      {/* Control Buttons */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton}>
          <Ionicons name="bulb" size={30} color="#FFEB3B" />
          <Text style={styles.controlButtonText}>Lights</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton}>
          <Ionicons name="water-outline" size={30} color="#2196F3" />
          <Text style={styles.controlButtonText}>Water</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton}>
          <MaterialCommunityIcons name="fan" size={30} color="#00BCD4" />
          <Text style={styles.controlButtonText}>Fan</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  statusContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  statusCard: {
    width: '45%',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  statusText: {
    fontSize: 16,
    color: '#757575',
    marginTop: 10,
  },
  statusValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 5,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 20,
  },
  controlButton: {
    width: '30%',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  controlButtonText: {
    fontSize: 16,
    color: '#757575',
    marginTop: 10,
  },
  footer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
});
