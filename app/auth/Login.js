import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CustomButton from "../../components/ui/CustomButton";
import CustomInput from "../../components/ui/CustomInput";
import { auth, db } from "../../firebase";

import { doc, getDoc } from "firebase/firestore";
import Toast from "react-native-toast-message";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const validate = () => {
    let valid = true;
    let newErrors = {};
    if (!email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
      valid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    } else if (password.length > 10) {
      newErrors.password = "Password cannot be more than 10 characters";
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };

  const handleLogin = async () => {
    if (validate()) {
      try {
        setLoading(true);
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        console.log(userCredential.user);
        Toast.show({
          type: "success",
          text1: "Login successful",
          text2: "Welcome back!",
          visibilityTime: 2500,
          position: "top",
        });

        const userDocRef = doc(db, "users", userCredential.user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();

          // 🔹 Save to AsyncStorage
          await AsyncStorage.setItem("userData", JSON.stringify(userData));
          await AsyncStorage.setItem(
            "token",
            userCredential.user.stsTokenManager.accessToken
          );
        }

        router.replace("/tabs/Home");
      } catch (error) {
        console.log(error.message);
        if (error.message === "Firebase: Error (auth/invalid-credential).") {
          console.log("Invalid credentials");
          Toast.show({
            type: "error",
            text1: "Invalid credentials",
            text2: "Please check your email and password",
            visibilityTime: 2500,
            position: "top",
          });
        } else {
          Toast.show({
            type: "error",
            text1: "Login failed",
            text2: error.message,
            visibilityTime: 2500,
            position: "top",
          });
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Image
            source={require("../../assets/images/splash.png")}
            style={styles.logo}
          />
          <Text style={styles.heading}>Login To Your Account</Text>

          <CustomInput
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            icon="email"
            error={errors.email}
            onClearError={() => setErrors((prev) => ({ ...prev, email: "" }))}
          />

          <CustomInput
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            icon="lock"
            error={errors.password}
            onClearError={() =>
              setErrors((prev) => ({ ...prev, password: "" }))
            }
          />

          <TouchableOpacity style={styles.forgetPassword}>
            <Link style={styles.forgetText} href="/auth/Forgetpassword">
              Forgot Password?
            </Link>
          </TouchableOpacity>

          <CustomButton title="Login" onPress={handleLogin} loading={loading} />

          <Text style={styles.bottomText}>
            Don’t have an account?{" "}
            <Link href="/auth/Signup" style={styles.link}>
              Sign Up
            </Link>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 20,
    justifyContent: "center",
  },
  logo: { width: 100, height: 100, alignSelf: "center", marginBottom: 20 },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#1D3F69",
  },
  forgetPassword: { alignSelf: "flex-end", marginVertical: 5 },
  forgetText: { color: "#1D3F69", fontSize: 13 },
  googleIcon: { position: "absolute", bottom: 140, left: "20%" },
  bottomText: {
    textAlign: "center",
    marginTop: 15,
    fontSize: 14,
    color: "#333",
  },
  link: {
    color: "#1D3F69",
    fontWeight: "bold",
  },
});
