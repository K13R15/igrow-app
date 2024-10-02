import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { View, Text, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "../constants";
import { CustomButton, Loader } from "../components";

const Welcome = () => {
  const [loading, setLoading] = useState(false);

  return (
    <SafeAreaView className="bg-lime-300 h-full">
      <Loader isLoading={loading} />

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 justify-center items-center px-4">
          {/* Logo */}
          <Image
            source={images.logo} // Replace with your app's logo
            className="w-64 h-24 mb-5 border-2 border-green-600 rounded-lg shadow-lg"
            resizeMode="contain"
          />

          {/* Intro Text */}
          <View className="mt-5 items-center">
            <Text className="text-3xl font-bold text-green-900 text-center">
              Grow Smarter{"\n"}
              with <Text className="text-green-500">iGROW</Text>
            </Text>
          </View>

          {/* Continue Button */}
          <CustomButton
            title="Get Started with iGROW"
            handlePress={() => router.push("/sign-in")} // Navigate to sign-in screen
            containerStyles="w-full mt-7 bg-green-700 rounded-full py-4 shadow-lg"
            textStyles="text-white text-center text-base font-semibold"
          />
        </View>
      </ScrollView>

      <StatusBar backgroundColor="#A3E635" style="light" />
    </SafeAreaView>
  );
};

export default Welcome;
