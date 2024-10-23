import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  Alert,
  Image,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient"; // Add gradient for background

import { images } from "../../constants";
import { createUser } from "../../lib/mysql";
import { CustomButton, FormField } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";

const SignUp = () => {
  const { setUser, setIsLogged } = useGlobalContext();

  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const submit = async () => {
    if (form.username === "" || form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
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
    <LinearGradient // Added a gradient background
      colors={["#A3E635", "#059669"]}
      style={styles.container}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View
            style={[
              styles.contentContainer,
              { minHeight: Dimensions.get("window").height - 100 },
            ]}
          >
            <Image
              source={images.logo}
              resizeMode="contain"
              style={styles.logo}
            />

            <Text style={styles.title}>
              Sign Up to <Text style={styles.highlightText}>iGROW</Text>
            </Text>

            <View style={styles.formCard}>
              <FormField
                title="Username"
                value={form.username}
                handleChangeText={(e) => setForm({ ...form, username: e })}
                otherStyles={styles.formField}
              />

              <FormField
                title="Email"
                value={form.email}
                handleChangeText={(e) => setForm({ ...form, email: e })}
                otherStyles={styles.formField}
                keyboardType="email-address"
              />

              <FormField
                title="Password"
                value={form.password}
                handleChangeText={(e) => setForm({ ...form, password: e })}
                otherStyles={styles.formField}
                secureTextEntry={true}
              />

              <CustomButton
                title="Sign Up"
                handlePress={submit}
                containerStyles={styles.signUpButton}
                textStyles={styles.buttonText}
                isLoading={isSubmitting}
              />
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Have an account?</Text>
              <Link href="/sign-in" style={styles.signInLink}>
                Sign in
              </Link>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "linear-gradient(180deg, #A3E635 0%, #059669 100%)", // Lime to green gradient
  },
  contentContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 40,
  },
  logo: {
    width: 115,
    height: 64,
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    fontWeight: "bold",
    color: "#065F46", // Primary text color (dark green)
    marginTop: 20,
  },
  highlightText: {
    color: "#15803D", // Green text color for emphasis
  },
  formCard: {
    backgroundColor: "#FFF", // White background for contrast
    padding: 20,
    borderRadius: 16,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5, // For Android shadow
    marginTop: 20,
  },
  formField: {
    marginTop: 20,
  },
  signUpButton: {
    width: "100%",
    marginTop: 28,
    backgroundColor: "#065F46", // Emerald green background for button
    borderRadius: 50,
    paddingVertical: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
  },
  buttonText: {
    color: "#FFF",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: 20,
  },
  footerText: {
    fontSize: 16,
    color: "#9CA3AF", // Muted gray text color
  },
  signInLink: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#34D399", // Light green link color
    marginLeft: 8,
  },
});

export default SignUp;
