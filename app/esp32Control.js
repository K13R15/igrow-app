// esp32Control.js

export const toggleWater = async (currentState, setWaterOn) => {
  const timeout = 5000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch("http://192.168.50.19/water/toggle", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.status === "success") {
      setWaterOn(data.state === "on");
      return data;
    }
    throw new Error("Unexpected response from ESP32");
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error(
        "Request timed out. Please check your connection to the device."
      );
    }
    throw error;
  }
};

export const togglePesticide = async (pesticideOn, setPesticideOn) => {
  try {
    const response = await fetch("http://192.168.50.19/pesticide/toggle", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      if (
        response.status === 400 &&
        data.message?.includes("Moisture level too high")
      ) {
        throw new Error(`MOISTURE_TOO_HIGH:${data.moisture}`);
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (data.status === "success") {
      setPesticideOn(data.state === "on");
      return true;
    }
    throw new Error("Unexpected response from ESP32");
  } catch (error) {
    console.error("Error in API request:", error);
    throw error;
  }
};

export const toggleFertilizer = async (fertilizerOn, setFertilizerOn) => {
  try {
    const response = await fetch("http://192.168.50.19/fertilizer/toggle", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      if (
        response.status === 400 &&
        data.message?.includes("Moisture level too high")
      ) {
        throw new Error(`MOISTURE_TOO_HIGH:${data.moisture}`);
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (data.status === "success") {
      setFertilizerOn(data.state === "on");
      return true;
    }
    throw new Error("Unexpected response from ESP32");
  } catch (error) {
    console.error("Error in API request:", error);
    throw error;
  }
};
