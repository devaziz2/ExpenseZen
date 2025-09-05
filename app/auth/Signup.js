import { Link, useRouter } from "expo-router";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

import CustomButton from "../../components/ui/CustomButton";
import CustomInput from "../../components/ui/CustomInput";
import { auth } from "../../firebase";

export default function SignupScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const validate = () => {
    let valid = true;
    let newErrors = {};

    if (!fullName) {
      newErrors.fullName = "Full name is required";
      valid = false;
    }

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

  const handleSignup = async () => {
    if (validate()) {
      try {
        setLoading(true);
        console.log("sign up data");
        console.log(auth);
        console.log(email);
        console.log(password);
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        await updateProfile(userCredential.user, {
          displayName: fullName,
        });

        console.log("✅ User created:", userCredential.user);
        Toast.show({
          type: "success",
          text1: "Account created",
          text2: "You can now log in",
          visibilityTime: 2500,
          position: "top",
        });
        router.replace("/auth/Login");
      } catch (error) {
        console.log(error.message);

        if (error.message === "Firebase: Error (auth/email-already-in-use).") {
          console.log("Email already in use");
          Toast.show({
            type: "error",
            text1: "Email already taken",
            text2: "Please use another email address",
            visibilityTime: 2500,
            position: "top",
          });
        } else {
          Toast.show({
            type: "error",
            text1: "Signup failed",
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
          <Text style={styles.heading}>Create An Account</Text>

          <CustomInput
            label="Full Name"
            placeholder="Enter your full name"
            value={fullName}
            onChangeText={setFullName}
            icon="person"
            error={errors.fullName}
            onClearError={() =>
              setErrors((prev) => ({ ...prev, fullName: "" }))
            }
          />

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

          <CustomButton
            title="Create Account"
            onPress={handleSignup}
            loading={loading}
          />

          <Text style={styles.bottomText}>
            Already have an account?{" "}
            <Link href="/auth/Login" style={styles.link}>
              Login
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
