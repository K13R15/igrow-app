export const PLANT_TYPES = {
  LEAFSTALK: {
    id: "leafstalk",
    name: "Leafstalk Vegetables",
    examples: ["Celery", "Lettuce", "Spinach", "Cabbage"],
    wateringNeeds: {
      frequency: 1, // days between watering
      duration: 30, // seconds
      waterAmount: "medium",
      moistureThreshold: 60, // minimum soil moisture percentage
    },
  },
  FRUITING: {
    id: "fruiting",
    name: "Fruiting Vegetables",
    examples: ["Tomatoes", "Peppers", "Eggplant", "Cucumbers"],
    wateringNeeds: {
      frequency: 2,
      duration: 45,
      waterAmount: "high",
      moistureThreshold: 70,
    },
  },
  ROOT: {
    id: "root",
    name: "Root Vegetables",
    examples: ["Carrots", "Potatoes", "Onions", "Radishes"],
    wateringNeeds: {
      frequency: 3,
      duration: 40,
      waterAmount: "medium",
      moistureThreshold: 65,
    },
  },
};
