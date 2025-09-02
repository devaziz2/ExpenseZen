import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const CustomInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  icon,
  error,
  onBlur,
  onClearError,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const errorOpacity = useRef(new Animated.Value(0)).current;
  const errorTranslateY = useRef(new Animated.Value(-5)).current;

  useEffect(() => {
    if (error) {
      Animated.parallel([
        Animated.timing(errorOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(errorTranslateY, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(errorOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(errorTranslateY, {
          toValue: -5,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [error]);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          { borderColor: isFocused ? "#1D3F69" : "#ccc" },
        ]}
      >
        {icon && (
          <MaterialIcons
            name={icon}
            size={20}
            color={isFocused ? "#1D3F69" : "#888"}
            style={styles.icon}
          />
        )}

        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={value}
          onChangeText={(text) => {
            onChangeText(text);
            if (error) {
              onClearError && onClearError();
            }
          }}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType || "default"}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            onBlur && onBlur();
          }}
        />

        {secureTextEntry && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={20}
              color={isFocused ? "#1D3F69" : "#888"}
              style={styles.icon}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Animated Error */}
      <Animated.View
        style={{
          opacity: errorOpacity,
          transform: [{ translateY: errorTranslateY }],
          marginTop: 3,
        }}
      >
        {error && <Text style={styles.error}>{error}</Text>}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 15 },
  label: { fontSize: 14, marginBottom: 5, color: "#333" },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 0.9,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    elevation: 2, // subtle shadow for premium look
  },
  input: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 16,
    color: "#000",
  },
  icon: { marginHorizontal: 5 },
  error: { color: "red", fontSize: 12 },
});

export default CustomInput;
