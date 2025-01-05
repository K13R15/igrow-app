import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
  Alert,
  ImageBackground,
  TextInput,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { Svg, Path } from "react-native-svg";
import { icons } from "../../constants";
import {
  signOut,
  uploadAvatar,
  getCurrentUser,
  updateUserProfile,
} from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import { Ionicons } from "@expo/vector-icons";

const LeafPattern = () => (
  <Svg
    height="100%"
    width="100%"
    viewBox="0 0 100 100"
    style={StyleSheet.absoluteFillObject}
  >
    <Path
      d="M20,50 Q30,60 50,50 T80,50"
      fill="none"
      stroke="rgba(255,255,255,0.1)"
      strokeWidth="2"
    />
    <Path
      d="M30,30 Q40,40 60,30 T90,30"
      fill="none"
      stroke="rgba(255,255,255,0.1)"
      strokeWidth="2"
    />
    <Path
      d="M10,70 Q20,80 40,70 T70,70"
      fill="none"
      stroke="rgba(255,255,255,0.1)"
      strokeWidth="2"
    />
  </Svg>
);

const Profile = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setEmail(currentUser.email);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    if (!user) {
      fetchUser();
    } else {
      setEmail(user.email);
    }
  }, []);

  const logout = async () => {
    try {
      await signOut();
      setUser(null);
      setIsLogged(false);
      router.replace("/sign-in");
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Error", "Failed to logout. Please try again.");
    }
  };

  const editProfilePicture = async () => {
    try {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        Alert.alert("Error", "Unable to fetch user details. Please try again.");
        return;
      }

      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Denied",
          "You need to allow access to your photos."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        Alert.alert(
          "Uploading...",
          "Please wait while we update your profile picture."
        );

        try {
          const updatedUser = await uploadAvatar(
            result.assets[0].uri,
            currentUser
          );
          if (updatedUser) {
            setUser(updatedUser);
            Alert.alert("Success", "Profile picture updated successfully!");
          } else {
            throw new Error("Failed to update user");
          }
        } catch (error) {
          console.error("Upload error:", error);
          Alert.alert(
            "Error",
            "Failed to upload profile picture. Please try again."
          );
        }
      }
    } catch (error) {
      console.error("Image picker error:", error);
      Alert.alert("Error", "Failed to access image library. Please try again.");
    }
  };

  const updateProfile = async () => {
    try {
      if (!user) {
        Alert.alert("Error", "User not found. Please log in again.");
        return;
      }

      const updatedUser = await updateUserProfile(user.id, email, password);
      if (updatedUser) {
        setUser(updatedUser);
        Alert.alert("Success", "Profile updated successfully!");
      } else {
        throw new Error("Failed to update user");
      }
    } catch (error) {
      console.error("Update profile error:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    }
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <ImageBackground
      source={{ uri: "/placeholder.svg?height=1080&width=1920" }}
      style={styles.container}
    >
      <LeafPattern />
      <LinearGradient
        colors={["rgba(163, 230, 53, 0.8)", "rgba(6, 95, 70, 0.8)"]}
        style={StyleSheet.absoluteFillObject}
      />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <TouchableOpacity onPress={logout} style={styles.logoutButton}>
            <LinearGradient
              colors={["#FF6B6B", "#FF8E8E"]}
              style={styles.logoutGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Image
                source={icons.logout}
                resizeMode="contain"
                style={styles.logoutIcon}
              />
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: user?.avatar }}
              style={styles.avatar}
              resizeMode="cover"
            />
            <TouchableOpacity
              style={styles.editAvatarButton}
              onPress={editProfilePicture}
            >
              <Ionicons name="camera" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>

          <Text style={styles.username}>{user?.username || "Username"}</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.updateButton} onPress={updateProfile}>
            <LinearGradient
              colors={["#4CAF50", "#45A049"]}
              style={styles.updateGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.updateButtonText}>Update Profile</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  logoutButton: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
  },
  logoutGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoutIcon: {
    width: 24,
    height: 24,
    tintColor: "#FFFFFF",
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderWidth: 3,
    borderColor: "#34D399",
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  avatar: {
    width: "90%",
    height: "90%",
    borderRadius: 54,
  },
  editAvatarButton: {
    position: "absolute",
    bottom: -5,
    right: -5,
    backgroundColor: "#34D399",
    borderRadius: 20,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 20,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 8,
    fontWeight: "600",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#333333",
  },
  updateButton: {
    width: "100%",
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
    marginTop: 20,
  },
  updateGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  updateButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Profile;
