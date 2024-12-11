import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
  FlatList,
  TextInput,
} from "react-native";
import { icons } from "../../constants";
import { signOut } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import { InfoBox } from "../../components";
import { Ionicons } from "@expo/vector-icons";

const Profile = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLogged(false);

    router.replace("/sign-in");
  };

  const editProfilePicture = () => {
    // Implement functionality to upload or change profile picture
    console.log("Edit profile picture clicked!");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Guide Button */}
      

      <View style={styles.content}>
        {/* Logout Button */}
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Image
            source={icons.logout}
            resizeMode="contain"
            style={styles.logoutIcon}
          />
        </TouchableOpacity>

        {/* Profile Picture with Edit Button */}
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

        {/* Username */}
        <InfoBox
          title={user?.username || "Username"}
          containerStyles={{ marginTop: 20 }}
          titleStyles={styles.username}
        />

        {/* Editable Bio Section */}
        <Text style={styles.sectionTitle}>About Me</Text>
        <TextInput
          style={styles.bioInput}
          placeholder="Write something about your garden..."
          multiline={true}
          defaultValue=""
        />

        
          
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#A3E635", // Matches HomeScreen background
  },
  content: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 48,
    paddingHorizontal: 16,
  },
  logoutButton: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 40,
  },
  logoutIcon: {
    width: 24,
    height: 24,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderWidth: 3,
    borderColor: "#34D399",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    position: "relative",
  },
  avatar: {
    width: "90%",
    height: "90%",
    borderRadius: 50,
  },
  editAvatarButton: {
    position: "absolute",
    bottom: -5,
    right: -5,
    backgroundColor: "#34D399",
    borderRadius: 20,
    padding: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#065F46",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#065F46",
    marginTop: 20,
    marginBottom: 10,
  },
  bioInput: {
    backgroundColor: "#FFF",
    width: "100%",
    padding: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    fontSize: 16,
    textAlignVertical: "top",
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  summaryLabel: {
    fontSize: 16,
    color: "#6B7280",
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#065F46",
  },
  helpButton: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: "#34D399", // Changed color to green
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  helpButtonText: {
    fontSize: 12,
    color: "#FFF",
    fontWeight: "bold",
    marginTop: 2,
  },
});

export default Profile;
