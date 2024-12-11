// esp32Control.js

export const toggleWater = async (waterOn, setWaterOn) => {
  const esp32Ip = "http://192.168.50.19"; // Replace this with your ESP32 IP address
  const endpoint = waterOn ? "/water/off" : "/water/on"; // Toggle based on the current state

  try {
    const response = await fetch(esp32Ip + endpoint, { method: "GET" });

    if (response.ok) {
      setWaterOn(!waterOn); // Toggle the state locally
    } else {
      console.error("Failed to toggle water pump");
    }
  } catch (error) {
    console.error("Error in API request:", error);
  }
};
