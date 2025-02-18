export const ESP32_CONFIG = {
  IP_ADDRESS: "192.168.50.19",
  BASE_URL: "http://192.168.50.19",
  DEBUG: true,
  RETRY_ATTEMPTS: 3,
  TIMEOUT: 10000,
  ENDPOINTS: {
    ROOT: "/",
    SCHEDULES: "/schedules",
    SCHEDULE: "/schedule",
    SETTINGS: "/settings",
    WATER: {
      ON: "/water/on",
      OFF: "/water/off",
    },
  },
};
