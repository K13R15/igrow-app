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
import { getCurrentUser, signIn } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";

const { width, height } = Dimensions.get("window");

const SignIn = () => {
  const { setUser, setIsLogged } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [rememberPassword, setRememberPassword] = useState(false);

  const submit = async () => {
    if (form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setSubmitting(true);

    try {
      await signIn(form.email, form.password);
      const result = await getCurrentUser();
      setUser(result);
      setIsLogged(true);

      Alert.alert("Success", "User signed in successfully");
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
            <View style={styles.leftColumn}>
              <Image
                source={images.logo}
                resizeMode="contain"
                style={styles.logo}
              />
              <Text style={styles.message}>
                Nurture your financial growth with iGROW </Text>
              <Text style={styles.message}>
                 Sign in to explore your path to prosperity.
              </Text>
            </View>

            {/* Right Column */}
            <BlurView intensity={80} tint="light" style={styles.rightColumn}>
              <Text style={styles.title}>
                Welcome to <Text style={styles.highlightText}>iGROW</Text>
              </Text>

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
                  secureTextEntry
                />
              </View>

              <View style={styles.optionsContainer}>
                <View style={styles.rememberPasswordContainer}>
                  <Switch
                    value={rememberPassword}
                    onValueChange={setRememberPassword}
                    trackColor={{ false: "#767577", true: "#059669" }}
                    thumbColor={rememberPassword ? "#f4f3f4" : "#f4f3f4"}
                  />
                  <Text style={styles.rememberPasswordText}>Remember password</Text>
                </View>
                <TouchableOpacity onPress={() => router.push("/forgot-password")}>
                  <Text style={styles.forgotPasswordLink}>Forgot password?</Text>
                </TouchableOpacity>
              </View>

              <CustomButton
                title="Sign In"
                handlePress={submit}
                containerStyles={styles.signInButton}
                textStyles={styles.buttonText}
                isLoading={isSubmitting}
              />

              <View style={styles.footer}>
                <Text style={styles.footerText}>Don't have an account?</Text>
                <TouchableOpacity onPress={() => router.push("/sign-up")}>
                  <Text style={styles.signUpLink}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </BlurView>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
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
    alignItems: "center",
    padding: 24,
    backgroundColor: 'rgba(34, 197, 94, 0.2)', // Light green with opacity
  },
  rightColumn: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
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
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  rememberPasswordContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rememberPasswordText: {
    marginLeft: 8,
    color: "#064E3B",
  },
  forgotPasswordLink: {
    color: "#059669",
    fontWeight: "600",
  },
  signInButton: {
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
  signUpLink: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#059669", // Medium green
    marginLeft: 8,
  },
});

export default SignIn;

