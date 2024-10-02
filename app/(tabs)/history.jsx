import { Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const activityLogs = [
  { id: 1, icon: "water", action: "Watered the garden", time: "10:00 AM" },
  {
    id: 2,
    icon: "weather-sunny",
    action: "Adjusted light levels",
    time: "12:00 PM",
  },
  {
    id: 3,
    icon: "thermometer",
    action: "Monitored temperature",
    time: "2:30 PM",
  },
  { id: 4, icon: "leaf", action: "Checked soil moisture", time: "4:15 PM" },
  // Add more logs as needed
];

const History = () => {
  return (
    <SafeAreaView className="px-4 my-6 bg-gradient-to-b from-lime-400 to-green-600 h-full">
      <Text className="text-3xl text-primary font-bold mb-6">
        Activity Logs
      </Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {activityLogs.map((log) => (
          <View
            key={log.id}
            className="flex-row items-center bg-white rounded-lg p-4 mb-4 shadow-lg"
          >
            <MaterialCommunityIcons
              name={log.icon}
              size={28}
              color="#34D399" // Soft green color for the icons
              className="mr-4"
            />
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-800">
                {log.action}
              </Text>
              <Text className="text-sm text-gray-500">{log.time}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default History;
