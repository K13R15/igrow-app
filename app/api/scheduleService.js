import axios from "axios";
import { ESP32_CONFIG } from "../config";
import { getSchedules } from "../../lib/appwrite";
import { PLANT_TYPES } from "../../constants/plantTypes";

const BASE_URL = ESP32_CONFIG.BASE_URL;

// Add debug logging
const log = (...args) => {
  if (ESP32_CONFIG.DEBUG) {
    console.log("[ESP32]", ...args);
  }
};

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: ESP32_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false,
});

// Add response interceptor for better error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    log("Request failed:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
);

// Add retry logic with exponential backoff
const retryRequest = async (fn, retries = 3, delay = 1000) => {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    log(`Retrying request... (${retries} attempts left)`);
    await new Promise((resolve) => setTimeout(resolve, delay));
    return retryRequest(fn, retries - 1, delay * 2);
  }
};

// Add retry logic for connection testing
const testConnectionWithRetry = async (attempts = 3, delay = 1000) => {
  for (let i = 0; i < attempts; i++) {
    try {
      log(`Connection attempt ${i + 1} of ${attempts}...`);
      const response = await axiosInstance.get(ESP32_CONFIG.ENDPOINTS.ROOT, {
        timeout: ESP32_CONFIG.TIMEOUT,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (response.status === 200) {
        log("Connection successful:", response.data);
        return { connected: true, data: response.data };
      }
    } catch (error) {
      log(`Attempt ${i + 1} failed:`, error.message);
      if (i < attempts - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  return {
    connected: false,
    error: `Failed to connect after ${attempts} attempts. Please check if the ESP32 is powered on and connected to the network.`,
  };
};

export const scheduleService = {
  async createSchedule(schedule) {
    try {
      log("Creating schedule:", schedule);

      // First store in Appwrite
      const appwriteSchedule = await createScheduleInAppwrite(schedule);

      // Then sync with ESP32
      try {
        const esp32Response = await retryRequest(() =>
          axiosInstance.post("/schedule/sync", {
            id: appwriteSchedule.$id,
            taskType: schedule.task.id,
            dateTime: Math.floor(schedule.date.getTime() / 1000),
            duration: schedule.careInstructions?.duration || 0,
            moistureThreshold:
              schedule.careInstructions?.moistureThreshold || 0,
          })
        );

        log("ESP32 sync successful:", esp32Response.data);
      } catch (error) {
        log("ESP32 sync failed:", error);
        // Don't fail if ESP32 sync fails - we still have the schedule in Appwrite
      }

      return appwriteSchedule;
    } catch (error) {
      log("Error creating schedule:", error);
      throw new Error(`Failed to create schedule: ${error.message}`);
    }
  },

  async getSchedules() {
    try {
      // Get schedules from Appwrite
      const schedules = await getSchedules();
      log("Fetched schedules from Appwrite:", schedules);

      // Map the schedules to include full plant type information
      const mappedSchedules = schedules.map((schedule) => {
        const plantType = Object.values(PLANT_TYPES).find(
          (type) => type.id === schedule.plantType
        );

        return {
          ...schedule,
          plantType: plantType || {
            id: schedule.plantType,
            name: "Unknown Plant",
          },
        };
      });

      return mappedSchedules;
    } catch (error) {
      log("Error fetching schedules:", error);
      return [];
    }
  },

  // Water control functions
  async turnWaterOn() {
    try {
      const response = await retryRequest(() => axiosInstance.get("/water/on"));
      return response.data;
    } catch (error) {
      console.error("Error turning water on:", error.message);
      throw new Error(`Failed to turn water on: ${error.message}`);
    }
  },

  async turnWaterOff() {
    try {
      const response = await retryRequest(() =>
        axiosInstance.get("/water/off")
      );
      return response.data;
    } catch (error) {
      console.error("Error turning water off:", error.message);
      throw new Error(`Failed to turn water off: ${error.message}`);
    }
  },

  // Connection test
  async testConnection() {
    try {
      log("Testing ESP32 connectivity...");
      return await testConnectionWithRetry();
    } catch (error) {
      log("Connection test failed:", error.message);
      return {
        connected: false,
        error: error.message,
      };
    }
  },

  async deleteSchedule(id) {
    try {
      log("Deleting schedule:", id);
      const response = await retryRequest(() =>
        axiosInstance.post("/schedule/delete", { id })
      );
      log("Delete response:", response.data);
      return response.data;
    } catch (error) {
      log("Error deleting schedule:", error);
      throw new Error(`Failed to delete schedule: ${error.message}`);
    }
  },
};
