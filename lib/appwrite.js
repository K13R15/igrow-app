import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";
import { ESP32_CONFIG } from "../app/config";
import { PLANT_TYPES } from "../constants/plantTypes";

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.insandev.igrow",
  projectId: "66fd16650015100cab85",
  storageId: "66fd178d00199c265b40",
  databaseId: "66fd17000016f903b944",
  userCollectionId: "66fd1775003af7d1c2b3",
  wateredDateTimeId: "675ed2db002e6d7ce770",
  checkSoilMoisture: "675edcfa0008d1a99877",
  checkHumidityId: "675eeeee00105eb10dea",
  checkLightIntensityId: "675ef242001130007121",
  checkTemperatureId: "675f007f003c122c31bc",
  plantSettingsId: "6788792400182f286de4",
  schedulesCollectionId: "678876ee0010540aee46",
  plantLifecycleId: "67888ff70009eaad842f",
};

const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

const account = new Account(client);
const storage = new Storage(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export { client, account, storage, avatars, databases };
export const checkTemperatureEvent = async (intensityLevel) => {
  try {
    const session = await account.get();
    const userId = session.$id; // Extract user ID from session
    const dateTime = new Date().toISOString(); // Current date and time

    await databases.createDocument(
      appwriteConfig.databaseId, // Database ID
      appwriteConfig.checkTemperatureId, // Ensure you have a collection for light intensity
      ID.unique(), // Unique Document ID
      {
        intensityLevel: intensityLevel, // Light intensity level
        createdAt: dateTime, // Date and time when the data was logged
        userId: userId, // User ID for reference
      }
    );
    console.log("Light intensity event logged:", dateTime);
  } catch (error) {
    console.error("Failed to log light intensity event:", error);
    Alert.alert("Error", "Failed to log light intensity event.");
  }
};

export const logLightIntensityEvent = async (intensityLevel) => {
  try {
    const session = await account.get();
    const userId = session.$id; // Extract user ID from session
    const dateTime = new Date().toISOString(); // Current date and time

    await databases.createDocument(
      appwriteConfig.databaseId, // Database ID
      appwriteConfig.checkLightIntensityId, // Ensure you have a collection for light intensity
      ID.unique(), // Unique Document ID
      {
        intensityLevel: intensityLevel, // Light intensity level
        createdAt: dateTime, // Date and time when the data was logged
        userId: userId, // User ID for reference
      }
    );
    console.log("Light intensity event logged:", dateTime);
  } catch (error) {
    console.error("Failed to log light intensity event:", error);
    Alert.alert("Error", "Failed to log light intensity event.");
  }
};

export const logHumidityEvent = async (humidityLevel) => {
  try {
    const session = await account.get();
    const userId = session.$id; // Extract user ID from session
    const dateTime = new Date().toISOString(); // Current date and time

    await databases.createDocument(
      appwriteConfig.databaseId, // Database ID
      appwriteConfig.checkHumidityId, // You may need to use a separate collection for humidity
      ID.unique(), // Unique Document ID
      {
        humidityLevel: humidityLevel, // Humidity level
        createdAt: dateTime, // Date and time when the data was logged
        userId: userId, // User ID for reference
      }
    );
    console.log("Humidity event logged:", dateTime);
  } catch (error) {
    console.error("Failed to log humidity event:", error);
    Alert.alert("Error", "Failed to log humidity event.");
  }
};

export const logSoilMoistureEvent = async (moistureLevel) => {
  try {
    const session = await account.get();
    const userId = session.$id; // Extract user ID from session
    const dateTime = new Date().toISOString(); // Current date and time

    await databases.createDocument(
      appwriteConfig.databaseId, // Database ID
      appwriteConfig.checkSoilMoisture, // Collection ID
      ID.unique(), // Unique Document ID
      {
        moistureLevel: moistureLevel, // Soil moisture level
        createdAt: dateTime, // Date and time when the data was logged
        userId: userId, // User ID for reference
      }
    );
    console.log("Soil moisture event logged:", dateTime);
  } catch (error) {
    console.error("Failed to log soil moisture event:", error);
    Alert.alert("Error", "Failed to log soil moisture event.");
  }
};

export const logWateringEvent = async () => {
  try {
    // Get user session to retrieve user ID
    const session = await account.get();
    const userId = session.$id; // Extract user ID from session

    const dateTime = new Date().toISOString(); // Current date and time
    await databases.createDocument(
      appwriteConfig.databaseId, // Database ID
      appwriteConfig.wateredDateTimeId, // Collection ID
      ID.unique(), // Unique Document ID
      {
        wateredAt: dateTime, // Watering date and time
        userId: userId, // Add userId to the document
      }
    );
    console.log("Water event logged:", dateTime);
  } catch (error) {
    console.error("Failed to log watering event:", error);
    Alert.alert("Error", "Failed to log watering event.");
  }
};

// Register user
export async function createUser(email, password, username) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    throw new Error(error);
  }
}

// Sign In
export async function signIn(email, password) {
  try {
    const session = await account.createEmailSession(email, password);

    return session;
  } catch (error) {
    throw new Error(error);
  }
}

// Get Account
export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    throw new Error(error);
  }
}

// Get Current User
export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

// Sign Out
export async function signOut() {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    throw new Error(error);
  }
}

// Upload File
export async function uploadFile(file, type) {
  if (!file) return;

  const { mimeType, ...rest } = file;
  const asset = { type: mimeType, ...rest };

  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      asset
    );

    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
}

// Get File Preview
export async function getFilePreview(fileId, type) {
  let fileUrl;

  try {
    if (type === "image") {
      fileUrl = storage.getFilePreview(
        appwriteConfig.storageId,
        fileId,
        2000,
        2000,
        "top",
        100
      );
    } else {
      throw new Error("Invalid file type");
    }

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
}

export async function uploadAvatar(uri, currentUser) {
  try {
    // First, convert URI to Blob
    const response = await fetch(uri);
    const blob = await response.blob();

    // Generate a unique file name
    const fileName = `avatar_${currentUser.$id}_${Date.now()}.jpg`;

    // Upload file to Appwrite Storage
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      blob
    );

    if (!uploadedFile) throw Error;

    // Get file preview URL
    const avatarUrl = storage.getFilePreview(
      appwriteConfig.storageId,
      uploadedFile.$id
    );

    // Update user document with new avatar URL
    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      currentUser.$id,
      {
        avatar: avatarUrl.toString(),
      }
    );

    return updatedUser;
  } catch (error) {
    console.error("Error uploading avatar:", error);
    throw error;
  }
}

// Add new function to handle plant settings
export async function updatePlantSettings(plantType, settings) {
  try {
    const session = await account.get();
    const userId = session.$id;

    // Create document with only the fields that exist in the schema
    const plantSettings = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.plantSettingsId,
      ID.unique(),
      {
        userId: userId,
        plantType: plantType.id,
        moistureThreshold: settings.moistureThreshold || 70,
        phThresholdMin: settings.phThreshold?.min || 5.5,
        phThresholdMax: settings.phThreshold?.max || 7.5,
        wateringDuration: settings.wateringDuration || 30,
        fertilizingSchedule: settings.fertilizingSchedule || 7,
        createdAt: new Date().toISOString(),
        isActive: true,
      }
    );

    await syncSettingsWithESP32(plantSettings);
    return plantSettings;
  } catch (error) {
    console.error("Failed to update plant settings:", error);
    throw error;
  }
}

// Function to sync settings with ESP32
async function syncSettingsWithESP32(settings) {
  try {
    const response = await fetch(`${ESP32_CONFIG.BASE_URL}/settings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(settings),
    });

    if (!response.ok) {
      throw new Error("Failed to sync settings with ESP32");
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to sync with ESP32:", error);
    throw error;
  }
}

export async function getPlantSettings(plantType) {
  try {
    const session = await account.get();
    const userId = session.$id;

    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.plantSettingsId,
      [
        Query.equal("userId", userId),
        Query.equal("plantType", plantType),
        Query.orderDesc("createdAt"),
        Query.limit(1),
      ]
    );

    return response.documents[0] || null;
  } catch (error) {
    console.error("Failed to get plant settings:", error);
    throw error;
  }
}

// Add function to manage schedules in Appwrite
export async function createSchedule(schedule) {
  try {
    const session = await account.get();
    const userId = session.$id;

    const scheduleDoc = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.schedulesCollectionId,
      ID.unique(),
      {
        userId: userId,
        plantType: schedule.plantType.id,
        taskType: schedule.task.id,
        dateTime: schedule.date.toISOString(),
        duration: schedule.careInstructions?.duration || 0,
        waterAmount: schedule.careInstructions?.waterAmount || "200ml",
        moistureThreshold: schedule.careInstructions?.moistureThreshold || 60,
        isActive: true,
        createdAt: new Date().toISOString(),
      }
    );

    await syncScheduleWithESP32(scheduleDoc);
    return scheduleDoc;
  } catch (error) {
    console.error("Failed to create schedule:", error);
    throw error;
  }
}

export async function getSchedules() {
  try {
    const session = await account.get();
    const userId = session.$id;

    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.schedulesCollectionId,
      [Query.equal("userId", userId), Query.orderDesc("dateTime")]
    );

    return response.documents.map((doc) => ({
      id: doc.$id,
      plantType: {
        id: doc.plantType,
        name: PLANT_TYPES[doc.plantType]?.name || doc.plantType,
      },
      task: {
        id: doc.taskType,
        name: doc.taskType.charAt(0).toUpperCase() + doc.taskType.slice(1),
      },
      date: new Date(doc.dateTime),
      careInstructions: {
        duration: doc.duration,
        waterAmount: doc.waterAmount,
        moistureThreshold: doc.moistureThreshold,
      },
      isActive: doc.isActive,
    }));
  } catch (error) {
    console.error("Failed to fetch schedules:", error);
    return [];
  }
}

// Function to sync schedule with ESP32 for execution
async function syncScheduleWithESP32(schedule) {
  try {
    const response = await fetch(`${ESP32_CONFIG.BASE_URL}/schedule/sync`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: schedule.$id,
        taskType: schedule.taskType,
        dateTime: new Date(schedule.dateTime).getTime() / 1000,
        duration: schedule.duration,
        moistureThreshold: schedule.moistureThreshold,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to sync schedule with ESP32");
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to sync with ESP32:", error);
    // Don't throw error - ESP32 sync is optional
    return null;
  }
}

// Add these functions to handle plant management
export async function addPlant(plantType, customCare = null) {
  try {
    const session = await account.get();
    const userId = session.$id;

    // Create plant lifecycle document
    const lifecycle = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.plantLifecycleId,
      ID.unique(),
      {
        userId: userId,
        plantType: plantType.id,
        currentStage: "seeding",
        plantedAt: new Date().toISOString(),
        isActive: true,
        estimatedHarvestDate: calculateEstimatedHarvestDate(plantType),
      }
    );

    // Get settings (either custom or default)
    const stageSettings = customCare || plantType.stageRequirements.seeding;

    // Create plant settings
    const plantSettings = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.plantSettingsId,
      ID.unique(),
      {
        userId: userId,
        plantType: plantType.id,
        lifecycleId: lifecycle.$id,
        moistureThreshold:
          stageSettings.moistureThreshold || stageSettings.moisture,
        wateringDuration: stageSettings.wateringDuration,
        fertilizingSchedule: stageSettings.fertilizingFrequency,
        phThresholdMin: stageSettings.phThresholdMin || stageSettings.ph?.min,
        phThresholdMax: stageSettings.phThresholdMax || stageSettings.ph?.max,
        isActive: true,
        createdAt: new Date().toISOString(),
      }
    );

    return { lifecycle, plantSettings };
  } catch (error) {
    console.error("Failed to add plant:", error);
    throw error;
  }
}

export async function getActivePlants(userId) {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.plantSettingsId,
      [Query.equal("userId", userId), Query.equal("isActive", true)]
    );

    return response.documents.map((doc) => ({
      id: doc.plantType,
      settings: {
        moistureThreshold: doc.moistureThreshold,
        phThreshold: {
          min: doc.phThresholdMin,
          max: doc.phThresholdMax,
        },
        wateringDuration: doc.wateringDuration,
        fertilizingSchedule: doc.fertilizingSchedule,
      },
    }));
  } catch (error) {
    console.error("Failed to get active plants:", error);
    return [];
  }
}

// Helper function to generate initial schedules for a plant
function generateInitialSchedules(plantType) {
  const now = new Date();
  const schedules = [];

  // Add watering schedule
  schedules.push({
    taskType: "water",
    date: new Date(
      now.getTime() +
        plantType.careNeeds.watering.frequency * 24 * 60 * 60 * 1000
    ),
    duration: plantType.careNeeds.watering.duration,
    careInstructions: {
      waterAmount: plantType.careNeeds.watering.waterAmount,
      moistureThreshold: plantType.careNeeds.watering.moistureThreshold,
    },
  });

  // Add fertilizing schedule
  schedules.push({
    taskType: "fertilize",
    date: new Date(
      now.getTime() +
        plantType.careNeeds.fertilizing.frequency * 24 * 60 * 60 * 1000
    ),
    duration: 30,
    careInstructions: {
      waterAmount: "0ml", // No water for fertilizing task
      moistureThreshold: plantType.careNeeds.watering.moistureThreshold,
    },
  });

  return schedules;
}

// Add new function to get active plant
export async function getActivePlant(userId) {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.plantLifecycleId,
      [
        Query.equal("userId", userId),
        Query.equal("isActive", true),
        Query.notEqual("currentStage", PLANT_LIFECYCLE_STAGES.HARVESTED),
      ]
    );

    return response.documents[0] || null;
  } catch (error) {
    console.error("Failed to get active plant:", error);
    throw error;
  }
}

// Add function to mark plant as harvested
export async function harvestPlant(lifecycleId) {
  try {
    const updated = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.plantLifecycleId,
      lifecycleId,
      {
        currentStage: PLANT_LIFECYCLE_STAGES.HARVESTED,
        isActive: false,
        harvestedAt: new Date().toISOString(),
      }
    );

    return updated;
  } catch (error) {
    console.error("Failed to harvest plant:", error);
    throw error;
  }
}

// Helper function to calculate estimated harvest date based on plant type
function calculateEstimatedHarvestDate(plantType) {
  const now = new Date();
  // Add the total growing period (in days) to current date
  now.setDate(now.getDate() + plantType.growthPeriod.total);
  return now.toISOString();
}

// Helper function to get stage-specific settings
function getStageSpecificSettings(plantType, stage) {
  const stageSettings = plantType.stageRequirements[stage];
  return {
    moistureThreshold: stageSettings.moisture,
    wateringDuration: stageSettings.wateringDuration,
    wateringFrequency: stageSettings.wateringFrequency,
    fertilizingSchedule: stageSettings.fertilizingFrequency,
    phThresholdMin: stageSettings.ph.min,
    phThresholdMax: stageSettings.ph.max,
    pesticideFrequency: stageSettings.pesticideFrequency,
    pesticideType: stageSettings.pesticideType,
    pesticideDuration: stageSettings.pesticideDuration,
  };
}

// Add function to update plant lifecycle stage
export async function updatePlantStage(lifecycleId, newStage) {
  try {
    const lifecycle = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.plantLifecycleId,
      lifecycleId
    );

    const plantType = PLANT_TYPES[lifecycle.plantType];
    const newSettings = getStageSpecificSettings(plantType, newStage);

    // Update lifecycle stage
    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.plantLifecycleId,
      lifecycleId,
      {
        currentStage: newStage,
        lastStageUpdate: new Date().toISOString(),
      }
    );

    // Update plant settings for new stage
    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.plantSettingsId,
      lifecycle.plantSettingsId,
      {
        ...newSettings,
        lastUpdated: new Date().toISOString(),
      }
    );

    return true;
  } catch (error) {
    console.error("Failed to update plant stage:", error);
    throw error;
  }
}

// Add plant lifecycle stages
export const PLANT_LIFECYCLE_STAGES = {
  SEEDING: "seeding",
  VEGETATIVE: "vegetative",
  FLOWERING: "flowering",
  HARVEST_READY: "harvest_ready",
  HARVESTED: "harvested",
  DIED: "died",
};

// Update the markPlantAsDied function
export async function markPlantAsDied(lifecycleId, reason = "") {
  if (!lifecycleId) {
    throw new Error("No lifecycle ID provided");
  }

  try {
    const plant = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.plantLifecycleId,
      lifecycleId
    );

    const updated = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.plantLifecycleId,
      lifecycleId,
      {
        currentStage: PLANT_LIFECYCLE_STAGES.DIED,
        isActive: false,
        diedAt: new Date().toISOString(),
        deathReason: reason,
      }
    );

    const settings = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.plantSettingsId,
      [Query.equal("lifecycleId", lifecycleId)] // Changed to match your schema
    );

    if (settings.documents.length > 0) {
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.plantSettingsId,
        settings.documents[0].$id,
        {
          isActive: false,
          deactivatedAt: new Date().toISOString(),
          deactivationReason: "Plant died: " + reason,
        }
      );
    }

    const schedules = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.schedulesCollectionId,
      [
        Query.equal("userId", plant.userId), // Using userId from the plant
        Query.equal("plantType", plant.plantType), // Using plantType from the plant
        Query.equal("isActive", true), // Only get active schedules
      ]
    );

    // Delete all schedules
    for (const schedule of schedules.documents) {
      console.log("Deleting schedule:", schedule.$id);
      try {
        await databases.deleteDocument(
          appwriteConfig.databaseId,
          appwriteConfig.schedulesCollectionId,
          schedule.$id
        );
      } catch (deleteError) {
        console.error("Error deleting schedule:", {
          scheduleId: schedule.$id,
          error: deleteError,
        });
      }
    }
    console.log("All schedules deleted");

    return updated;
  } catch (error) {}
}

// Update the generateGrowthStageSchedules function
const generateGrowthStageSchedules = async (plantType, lifecycleId) => {
  try {
    const now = new Date();
    const schedules = [];

    // ... existing watering and fertilizing schedules ...

    // Generate recurring pesticide schedules if pesticide frequency > 0
    if (plantType.stageRequirements.seeding.pesticideFrequency > 0) {
      for (
        let i = 0;
        i < 30;
        i += plantType.stageRequirements.seeding.pesticideFrequency
      ) {
        const pesticideSchedule = {
          plantType: plantType,
          task: { id: "pesticide", name: "Pesticide Application" },
          date: new Date(now.getTime() + (i + 1) * 24 * 60 * 60 * 1000),
          careInstructions: {
            duration: plantType.stageRequirements.seeding.pesticideDuration,
            pesticideType: plantType.stageRequirements.seeding.pesticideType,
            instructions: `Apply ${plantType.stageRequirements.seeding.pesticideType} for pest prevention`,
          },
        };
        await createSchedule(pesticideSchedule);
        schedules.push(pesticideSchedule);
      }
    }

    return schedules;
  } catch (error) {
    console.error("Failed to generate growth stage schedules:", error);
    throw error;
  }
};

export const listUsers = async () => {
  try {
    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId
    );
    return users;
  } catch (error) {
    console.error("Error checking users:", error);
    return { total: 0 }; // Return default value if error occurs
  }
};
