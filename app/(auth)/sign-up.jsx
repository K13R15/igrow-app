import React, { useState } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  Alert,
  ImageBackground,
  TouchableOpacity,
  Switch,
  TextInput,
} from "react-native";
import { BlurView } from "expo-blur";
import { images } from "../../constants";
import { CustomButton } from "../../components";
import { createUser } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";

const { width, height } = Dimensions.get("window");

const SignUp = () => {
  const { setUser, setIsLogged } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberPassword, setRememberPassword] = useState(false);

  const submit = async () => {
    if (
      !form.username ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (form.password !== form.confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setSubmitting(true);
    try {
      const result = await createUser(form.email, form.password, form.username);
      setUser(result);
      setIsLogged(true);
      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ImageBackground
      source={{ uri: "/placeholder.svg?height=1080&width=1920" }}
      style={styles.backgroundImage}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.contentContainer}>
            {/* Left Column */}
            <BlurView intensity={80} tint="light" style={styles.leftColumn}>
              <Text style={styles.title}>
                Join <Text style={styles.highlightText}>iGROW</Text>
              </Text>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Username</Text>
                <TextInput
                  style={styles.input}
                  value={form.username}
                  onChangeText={(text) => setForm({ ...form, username: text })}
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={form.email}
                  onChangeText={(text) => setForm({ ...form, email: text })}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Password</Text>
                <TextInput
                  style={styles.input}
                  value={form.password}
                  onChangeText={(text) => setForm({ ...form, password: text })}
                  secureTextEntry={!showPassword}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Confirm Password</Text>
                <TextInput
                  style={styles.input}
                  value={form.confirmPassword}
                  onChangeText={(text) =>
                    setForm({ ...form, confirmPassword: text })
                  }
                  secureTextEntry={!showPassword}
                />
              </View>

              <View style={styles.passwordOptionsContainer}>
                <TouchableOpacity
                  style={styles.showButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Text style={styles.showButtonText}>
                    {showPassword ? "Hide" : "Show"} Password
                  </Text>
                </TouchableOpacity>

                <View style={styles.rememberPasswordContainer}>
                  <Switch
                    value={rememberPassword}
                    onValueChange={setRememberPassword}
                    trackColor={{ false: "#767577", true: "#059669" }}
                    thumbColor={rememberPassword ? "#f4f3f4" : "#f4f3f4"}
                  />
                  <Text style={styles.rememberPasswordText}>
                    Remember password
                  </Text>
                </View>
              </View>

              <CustomButton
                title="Sign Up"
                handlePress={submit}
                containerStyles={styles.signUpButton}
                textStyles={styles.buttonText}
                isLoading={isSubmitting}
              />

              <View style={styles.footer}>
                <Text style={styles.footerText}>Have an account?</Text>
                <TouchableOpacity onPress={() => router.push("/sign-in")}>
                  <Text style={styles.signInLink}>Sign in</Text>
                </TouchableOpacity>
              </View>
            </BlurView>

            {/* Right Column */}
            <View style={styles.rightColumn}>
              <Image
                source={images.logo}
                resizeMode="contain"
                style={styles.logo}
              />
              <Text style={styles.message}>
                Plant the seeds of your financial future
              </Text>
              <Text style={styles.message}>
                Join iGROW and watch   your wealth flourish
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  safeArea: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
    flexDirection: "row",
  },
  leftColumn: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
  },
  rightColumn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "rgba(34, 197, 94, 0.2)", // Light green with opacity
  },
  logo: {
    width: width * 0.25,
    height: width * 0.25,
    marginBottom: 24,
  },
  message: {
    fontSize: 18,
    color: "#064E3B", // Dark green
    textAlign: "center",
    marginBottom: 24,
    fontWeight: "600",
  },
  title: {
    fontSize: 28,
    textAlign: "center",
    fontWeight: "bold",
    color: "#065F46", // Dark green
    marginBottom: 30,
  },
  highlightText: {
    color: "#059669", // Medium green
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: "#064E3B",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  passwordOptionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  showButton: {
    padding: 8,
  },
  showButtonText: {
    color: "#059669", // Medium green
    fontSize: 16,
    fontWeight: "bold",
  },
  rememberPasswordContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rememberPasswordText: {
    marginLeft: 8,
    color: "#064E3B",
  },
  signUpButton: {
    width: "100%",
    marginTop: 28,
    backgroundColor: "#059669", // Medium green
    borderRadius: 12,
    paddingVertical: 16,
    shadowColor: "#064E3B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  footerText: {
    fontSize: 16,
    color: "#065F46", // Dark green
  },
  signInLink: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#059669", // Medium green
    marginLeft: 8,
  },
});

export default SignUp;
