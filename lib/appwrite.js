import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";

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
