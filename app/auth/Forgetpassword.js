import { sendPasswordResetEmail } from "firebase/auth";
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

export default function Forgetpassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async () => {
    if (!email) {
      Toast.show({
        type: "error",
        text1: "Email required",
        text2: "Please enter your email address",
        position: "top",
      });
      return;
    }

    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      Toast.show({
        type: "success",
        text1: "Password reset email sent",
        text2: "Check your inbox to reset your password",
        position: "top",
      });
      setEmail("");
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        Toast.show({
          type: "error",
          text1: "User not found",
          text2: "No account exists with this email address",
          position: "top",
        });
      } else if (error.code === "auth/invalid-email") {
        Toast.show({
          type: "error",
          text1: "Invalid Email",
          text2: "Please enter a valid email address",
          position: "top",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: error.message,
          position: "top",
        });
      }
    } finally {
      setLoading(false);
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
          <Text style={styles.heading}>Forgot Password?</Text>
          <Text style={styles.subText}>
            Enter your email and we’ll send you instructions to reset your
            password.
          </Text>

          <CustomInput
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            icon="email"
          />

          <CustomButton
            title={loading ? "Sending..." : "Reset Password"}
            onPress={handlePasswordReset}
          />
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
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#1D3F69",
  },
  subText: {
    fontSize: 14,
    textAlign: "center",
    color: "#555",
    marginBottom: 20,
  },
});
