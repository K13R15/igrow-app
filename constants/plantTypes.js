export const PLANT_TYPES = {
  LEAFY_VEGETABLES: {
    id: "leafy_vegetables",
    name: "Leafy Vegetables",
    examples: ["Lettuce", "Spinach", "Cabbage", "Kale", "Bok Choy"],
    growthPeriod: {
      seeding: 7, // days
      vegetative: 25,
      flowering: 10, // most leafy vegetables harvested before flowering
      harvest: 3,
      total: 45,
    },
    stageRequirements: {
      seeding: {
        moisture: 80,
        wateringDuration: 10,
        wateringFrequency: 2, // times per day
        fertilizingFrequency: 0,
        ph: { min: 6.0, max: 7.0 },
        pesticideFrequency: 30, // Apply pesticide every 30 days
        pesticideType: "Neem oil spray",
        pesticideDuration: 15, // seconds to spray
      },
      vegetative: {
        moisture: 75,
        wateringDuration: 20,
        wateringFrequency: 2,
        fertilizingFrequency: 7, // every 7 days
        ph: { min: 6.0, max: 7.0 },
        pesticideFrequency: 21, // More frequent during vegetative stage
        pesticideType: "Neem oil spray",
        pesticideDuration: 20,
      },
      flowering: {
        moisture: 70,
        wateringDuration: 15,
        wateringFrequency: 1,
        fertilizingFrequency: 0, // reduce fertilizer before harvest
        ph: { min: 6.0, max: 7.0 },
        pesticideFrequency: 30, // Less frequent during flowering
        pesticideType: "Organic insecticidal soap",
        pesticideDuration: 15,
      },
      harvest_ready: {
        moisture: 65,
        wateringDuration: 10,
        wateringFrequency: 1,
        fertilizingFrequency: 0,
        ph: { min: 6.0, max: 7.0 },
        pesticideFrequency: 0, // No pesticides close to harvest
        pesticideType: "None",
        pesticideDuration: 0,
      },
    },
  },

  FRUITING_VEGETABLES: {
    id: "fruiting_vegetables",
    name: "Fruiting Vegetables",
    examples: ["Tomatoes", "Peppers", "Eggplants", "Cucumbers", "Squash"],
    growthPeriod: {
      seeding: 14,
      vegetative: 30,
      flowering: 25,
      harvest: 7,
      total: 76,
    },
    stageRequirements: {
      seeding: {
        moisture: 80,
        wateringDuration: 15,
        wateringFrequency: 1,
        fertilizingFrequency: 0,
        ph: { min: 5.8, max: 6.8 },
        pesticideFrequency: 30,
        pesticideType: "Neem oil spray",
        pesticideDuration: 15,
      },
      vegetative: {
        moisture: 70,
        wateringDuration: 30,
        wateringFrequency: 2,
        fertilizingFrequency: 7,
        ph: { min: 5.8, max: 6.8 },
        pesticideFrequency: 21,
        pesticideType: "Neem oil spray",
        pesticideDuration: 20,
      },
      flowering: {
        moisture: 65,
        wateringDuration: 45,
        wateringFrequency: 2,
        fertilizingFrequency: 5,
        ph: { min: 6.0, max: 6.5 },
        pesticideFrequency: 30,
        pesticideType: "Organic insecticidal soap",
        pesticideDuration: 15,
      },
      harvest_ready: {
        moisture: 60,
        wateringDuration: 30,
        wateringFrequency: 1,
        fertilizingFrequency: 0,
        ph: { min: 6.0, max: 6.5 },
        pesticideFrequency: 0,
        pesticideType: "None",
        pesticideDuration: 0,
      },
    },
  },

  ROOT_VEGETABLES: {
    id: "root_vegetables",
    name: "Root Vegetables",
    examples: ["Carrots", "Potatoes", "Radishes", "Onions", "Turnips"],
    growthPeriod: {
      seeding: 10,
      vegetative: 35,
      flowering: 15,
      harvest: 5,
      total: 65,
    },
    stageRequirements: {
      seeding: {
        moisture: 75,
        wateringDuration: 20,
        wateringFrequency: 1,
        fertilizingFrequency: 0,
        ph: { min: 6.0, max: 7.0 },
      },
      vegetative: {
        moisture: 70,
        wateringDuration: 35,
        wateringFrequency: 1,
        fertilizingFrequency: 14, // less frequent fertilizing for root vegetables
        ph: { min: 6.0, max: 7.0 },
      },
      flowering: {
        moisture: 65,
        wateringDuration: 30,
        wateringFrequency: 1,
        fertilizingFrequency: 0, // reduce fertilizer to promote root development
        ph: { min: 6.0, max: 7.0 },
      },
      harvest_ready: {
        moisture: 60,
        wateringDuration: 25,
        wateringFrequency: 1,
        fertilizingFrequency: 0,
        ph: { min: 6.0, max: 7.0 },
      },
    },
  },

  LEGUMES: {
    id: "legumes",
    name: "Legumes",
    examples: ["Beans", "Peas", "Soybeans", "Lentils", "Peanuts"],
    growthPeriod: {
      seeding: 7,
      vegetative: 28,
      flowering: 20,
      harvest: 10,
      total: 65,
    },
    stageRequirements: {
      seeding: {
        moisture: 75,
        wateringDuration: 15,
        wateringFrequency: 1,
        fertilizingFrequency: 0,
        ph: { min: 6.0, max: 7.0 },
      },
      vegetative: {
        moisture: 70,
        wateringDuration: 25,
        wateringFrequency: 1,
        fertilizingFrequency: 14, // less fertilizer needed due to nitrogen fixing
        ph: { min: 6.0, max: 7.0 },
      },
      flowering: {
        moisture: 65,
        wateringDuration: 30,
        wateringFrequency: 2,
        fertilizingFrequency: 0,
        ph: { min: 6.0, max: 7.0 },
      },
      harvest_ready: {
        moisture: 55,
        wateringDuration: 20,
        wateringFrequency: 1,
        fertilizingFrequency: 0,
        ph: { min: 6.0, max: 7.0 },
      },
    },
  },

  BRASSICAS: {
    id: "brassicas",
    name: "Brassicas",
    examples: ["Broccoli", "Cauliflower", "Brussels Sprouts", "Cabbage"],
    growthPeriod: {
      seeding: 10,
      vegetative: 40,
      flowering: 15,
      harvest: 5,
      total: 70,
    },
    stageRequirements: {
      seeding: {
        moisture: 80,
        wateringDuration: 15,
        wateringFrequency: 2,
        fertilizingFrequency: 0,
        ph: { min: 6.0, max: 7.0 },
      },
      vegetative: {
        moisture: 75,
        wateringDuration: 30,
        wateringFrequency: 2,
        fertilizingFrequency: 7,
        ph: { min: 6.0, max: 7.0 },
      },
      flowering: {
        moisture: 70,
        wateringDuration: 25,
        wateringFrequency: 1,
        fertilizingFrequency: 10,
        ph: { min: 6.0, max: 7.0 },
      },
      harvest_ready: {
        moisture: 65,
        wateringDuration: 20,
        wateringFrequency: 1,
        fertilizingFrequency: 0,
        ph: { min: 6.0, max: 7.0 },
      },
    },
  },
};
