import React from "react";
import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";

const App = () => {
  return (
    <View className="flex-1 bg-gradient-to-b from-lime-400 to-green-600 px-5 py-8 justify-between">
      {/* Header */}
      <View className="flex-row justify-between items-center pt-10 pb-5">
        <Text className="text-4xl font-bold text-green-600">iGROW</Text>
        <Ionicons name="leaf" size={40} color="#4CAF50" />
      </View>

      {/* Status Overview */}
      <ScrollView
        contentContainerStyle={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-around",
        }}
      >
        <View className="w-[45%] bg-white p-5 rounded-lg items-center my-2 shadow-md">
          <MaterialCommunityIcons
            name="temperature-celsius"
            size={30}
            color="#FF5722"
          />
          <Text className="text-lg text-gray-600 mt-2">Temperature</Text>
          <Text className="text-xl font-bold text-green-600 mt-1">24°C</Text>
        </View>

        <View className="w-[45%] bg-white p-5 rounded-lg items-center my-2 shadow-md">
          <Ionicons name="water" size={30} color="#2196F3" />
          <Text className="text-lg text-gray-600 mt-2">Humidity</Text>
          <Text className="text-xl font-bold text-green-600 mt-1">60%</Text>
        </View>

        <View className="w-[45%] bg-white p-5 rounded-lg items-center my-2 shadow-md">
          <FontAwesome5 name="seedling" size={30} color="#8BC34A" />
          <Text className="text-lg text-gray-600 mt-2">Soil Moisture</Text>
          <Text className="text-xl font-bold text-green-600 mt-1">80%</Text>
        </View>

        <View className="w-[45%] bg-white p-5 rounded-lg items-center my-2 shadow-md">
          <MaterialCommunityIcons
            name="weather-sunny"
            size={30}
            color="#FFC107"
          />
          <Text className="text-lg text-gray-600 mt-2">Light Intensity</Text>
          <Text className="text-xl font-bold text-green-600 mt-1">High</Text>
        </View>
      </ScrollView>

      {/* Control Buttons */}
      <View className="flex-row justify-around my-5">
        <TouchableOpacity className="w-[30%] bg-white p-4 rounded-lg items-center shadow-md">
          <Ionicons name="bulb" size={30} color="#FFEB3B" />
          <Text className="text-lg text-gray-600 mt-2">Lights</Text>
        </TouchableOpacity>

        <TouchableOpacity className="w-[30%] bg-white p-4 rounded-lg items-center shadow-md">
          <Ionicons name="water-outline" size={30} color="#2196F3" />
          <Text className="text-lg text-gray-600 mt-2">Water</Text>
        </TouchableOpacity>

        <TouchableOpacity className="w-[30%] bg-white p-4 rounded-lg items-center shadow-md">
          <MaterialCommunityIcons name="fan" size={30} color="#00BCD4" />
          <Text className="text-lg text-gray-600 mt-2">Fan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default App;
