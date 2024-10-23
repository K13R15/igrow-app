import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";

import { icons } from "../../constants";
import { signOut } from "../../lib/mysql";
import { useGlobalContext } from "../../context/GlobalProvider";
import { InfoBox } from "../../components";

const Profile = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLogged(false);

    router.replace("/sign-in");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Image
            source={icons.logout}
            resizeMode="contain"
            style={styles.logoutIcon}
          />
        </TouchableOpacity>

        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: user?.avatar }}
            style={styles.avatar}
            resizeMode="cover"
          />
        </View>

        <InfoBox
          title={user?.username}
          containerStyles={{ marginTop: 20 }}
          titleStyles={styles.username}
        />

        <View style={styles.extraContainer}></View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "linear-gradient(180deg, limegreen 0%, green 100%)",
    flex: 1,
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
    width: 64,
    height: 64,
    borderWidth: 2,
    borderColor: "#34D399", // Light green for border
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: "90%",
    height: "90%",
    borderRadius: 12,
  },
  username: {
    fontSize: 18,
    color: "#1F2937", // Dark text color
    fontWeight: "600",
  },
  extraContainer: {
    marginTop: 20,
    flexDirection: "row",
  },
});

export default Profile;
