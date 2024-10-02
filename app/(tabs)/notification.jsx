import { Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const notifications = [
  {
    id: 1,
    icon: "water-pump",
    message: "Watering system activated",
    time: "10:00 AM",
  },
  {
    id: 2,
    icon: "weather-sunny",
    message: "Light intensity adjusted to 70%",
    time: "12:30 PM",
  },
  {
    id: 3,
    icon: "thermometer",
    message: "Temperature reached 25°C",
    time: "2:00 PM",
  },
  {
    id: 4,
    icon: "leaf",
    message: "Soil moisture is optimal",
    time: "4:15 PM",
  },
  // Add more notifications as needed
];

const Notification = () => {
  return (
    <SafeAreaView className="px-4 py-6 bg-gradient-to-b from-lime-400 to-green-600 h-full">
      <Text className="text-3xl font-bold text-primary mb-6">
        Notifications
      </Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {notifications.map((notification) => (
          <View
            key={notification.id}
            className="flex-row items-center bg-white rounded-lg p-4 mb-4 shadow-lg"
          >
            <MaterialCommunityIcons
              name={notification.icon}
              size={28}
              color="#34D399" // Soft green color for the icons
              className="mr-4"
            />
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-800">
                {notification.message}
              </Text>
              <Text className="text-sm text-gray-500">{notification.time}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Notification;
