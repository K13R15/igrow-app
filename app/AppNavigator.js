import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack"; // For stack navigation
import Ionicons from "react-native-vector-icons/Ionicons";
import HomeScreen from "./(tabs)/home"; // Main dashboard screen
import TemperatureScreen from "./Temperature"; // Temperature detail screen
import HumidityScreen from "./Humidity";
import SoilMoistureScreen from "./SoilMoisture";
import LightIntensityScreen from "./LightIntensity";

// Create stack for Home tab
const Stack = createStackNavigator();
const HomeStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Dashboard" }}
      />
      <Stack.Screen
        name="Temperature"
        component={TemperatureScreen}
        options={{ title: "Temperature Details" }}
      />
      <Stack.Screen
        name="settings"
        component={SettingsScreen}
        options={{ title: "settings" }}
      />
      <Stack.Screen
        name="Humidity"
        component={HumidityScreen}
        options={{ title: "Humidity Details" }}
      />
      <Stack.Screen
        name="Soil Moisture"
        component={SoilMoistureScreen}
        options={{ title: "Soil Moisture Details" }}
      />
      <Stack.Screen
        name="Light Intensity"
        component={LightIntensityScreen}
        options={{ title: "Light Intensity Details" }}
      />
    </Stack.Navigator>
  );
};

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "HomeTab") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "Settings") {
              iconName = focused ? "Settings" : "settings-outline";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#4CAF50",
          tabBarInactiveTintColor: "gray",
        })}
      >
        <Tab.Screen
          name="HomeTab"
          component={HomeStackNavigator}
          options={{ title: "Home" }}
        />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
