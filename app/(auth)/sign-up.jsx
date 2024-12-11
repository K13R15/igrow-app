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
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient"; 

import { images } from "../../constants";
import { createUser } from "../../lib/appwrite";
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
  const [showPassword, setShowPassword] = useState(false); // Toggle state

  const submit = async () => {
    if (!form.username || !form.email || !form.password) {
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
    <LinearGradient colors={["#A3E635", "#059669"]} style={styles.container}>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View
            style={[
              styles.contentContainer,
              { minHeight: Dimensions.get("window").height - 100 },
            ]}
          >
            <Image source={images.logo} resizeMode="contain" style={styles.logo} />

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

              <View style={styles.passwordContainer}>
                <FormField
                  title="Password"
                  value={form.password}
                  handleChangeText={(e) => setForm({ ...form, password: e })}
                  otherStyles={styles.formField}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  style={styles.showButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Text style={styles.showButtonText}>
                    {showPassword ? "Hide" : "Show"}
                  </Text>
                </TouchableOpacity>
              </View>

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
    color: "#065F46",
    marginTop: 20,
  },
  highlightText: {
    color: "#15803D",
  },
  formCard: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 16,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginTop: 20,
  },
  formField: {
    marginTop: 20,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  showButton: {
    position: "absolute",
    right: 10,
    top: 50,
  },
  showButtonText: {
    color: "#34D399",
    fontSize: 16,
    fontWeight: "bold",
  },
  signUpButton: {
    width: "100%",
    marginTop: 28,
    backgroundColor: "#065F46",
    borderRadius: 50,
    paddingVertical: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
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
    color: "#9CA3AF",
  },
  signInLink: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#34D399",
    marginLeft: 8,
  },
});

export default SignUp;
