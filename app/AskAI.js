import { Ionicons } from "@expo/vector-icons";
import { GoogleGenAI } from "@google/genai";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function AskAIScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef(null);
  const typingDot1 = useRef(new Animated.Value(0)).current;
  const typingDot2 = useRef(new Animated.Value(0)).current;
  const typingDot3 = useRef(new Animated.Value(0)).current;

  const GEMINI_API_KEY = "AIzaSyB0FmseqYQoDhcgcMylzti8DlJ-85X7ptY";

  // Typing animation
  const startTypingAnimation = () => {
    const animateDot = (dot, delay) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: -10,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      );
    };

    Animated.parallel([
      animateDot(typingDot1, 0),
      animateDot(typingDot2, 200),
      animateDot(typingDot3, 400),
    ]).start();
  };

  const stopTypingAnimation = () => {
    typingDot1.stopAnimation();
    typingDot2.stopAnimation();
    typingDot3.stopAnimation();
    typingDot1.setValue(0);
    typingDot2.setValue(0);
    typingDot3.setValue(0);
  };

  // Send message to Gemini API
  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = { role: "user", text: inputText };
    setMessages((prev) => [...prev, userMessage]);
    const messageToSend = inputText;
    setInputText("");
    setIsTyping(true);
    startTypingAnimation();

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      console.log("🚀 Sending request to Gemini API...");
      console.log("📝 Message:", messageToSend);

      // Initialize the AI client
      const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

      // Enhanced financial advisor prompt
      const financialPrompt = `You are a helpful financial advisor assistant for a budgeting mobile app. 

User's question: "${messageToSend}"

Please provide clear, practical financial advice in 2-3 short paragraphs. Focus on actionable steps and be encouraging. Keep your response under 200 words.`;

      // Call Gemini API
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-exp",
        contents: financialPrompt,
      });

      console.log("✅ AI Response received successfully");

      const aiMessage = {
        role: "ai",
        text: response.text,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("❌ Error calling Gemini API:", error);
      console.error("Error details:", error.message);

      const errorMessage = {
        role: "ai",
        text: "Sorry, I couldn't process your request. Please check your internet connection and try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
      stopTypingAnimation();
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      {/* Header */}
      <LinearGradient
        colors={["#4285F4", "#34A853", "#FBBC05", "#EA4335"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>

          <View style={styles.headerTextContainer}>
            <View style={styles.titleRow}>
              <Ionicons name="sparkles" size={28} color="#fff" />
              <Text style={styles.headerTitle}>Ask AI</Text>
            </View>
            <Text style={styles.headerSubtitle}>
              Get suggestions and recommendations instantly
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Messages Area */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.length === 0 ? (
          <View style={styles.emptyState}>
            <LinearGradient
              colors={["#4285F4", "#34A853"]}
              style={styles.emptyIconContainer}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="bulb-outline" size={50} color="#fff" />
            </LinearGradient>
            <Text style={styles.emptyTitle}>How can I help you today?</Text>
            <Text style={styles.emptySubtitle}>
              Ask me anything about budgeting, finance, or get personalized
              recommendations
            </Text>

            {/* Example questions */}
            <View style={styles.exampleContainer}>
              <TouchableOpacity
                style={styles.exampleBubble}
                onPress={() => setInputText("How can I save $500 per month?")}
              >
                <Text style={styles.exampleText}>
                  💰 How to save $500/month?
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.exampleBubble}
                onPress={() => setInputText("Create a budget plan for me")}
              >
                <Text style={styles.exampleText}>📊 Create a budget plan</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.exampleBubble}
                onPress={() => setInputText("Tips to reduce monthly expenses")}
              >
                <Text style={styles.exampleText}>💡 Reduce expenses tips</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          messages.map((message, index) => (
            <View
              key={index}
              style={[
                styles.messageBubble,
                message.role === "user" ? styles.userBubble : styles.aiBubble,
              ]}
            >
              {message.role === "ai" && (
                <View style={styles.aiAvatar}>
                  <Ionicons name="sparkles" size={16} color="#4285F4" />
                </View>
              )}
              <View
                style={[
                  styles.messageContent,
                  message.role === "user"
                    ? styles.userMessageContent
                    : styles.aiMessageContent,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    message.role === "user"
                      ? styles.userMessageText
                      : styles.aiMessageText,
                  ]}
                >
                  {message.text}
                </Text>
              </View>
            </View>
          ))
        )}

        {/* Typing Indicator */}
        {isTyping && (
          <View style={[styles.messageBubble, styles.aiBubble]}>
            <View style={styles.aiAvatar}>
              <Ionicons name="sparkles" size={16} color="#4285F4" />
            </View>
            <View style={[styles.messageContent, styles.aiMessageContent]}>
              <View style={styles.typingContainer}>
                <Animated.View
                  style={[
                    styles.typingDot,
                    { transform: [{ translateY: typingDot1 }] },
                  ]}
                />
                <Animated.View
                  style={[
                    styles.typingDot,
                    { transform: [{ translateY: typingDot2 }] },
                  ]}
                />
                <Animated.View
                  style={[
                    styles.typingDot,
                    { transform: [{ translateY: typingDot3 }] },
                  ]}
                />
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Ask me anything..."
            placeholderTextColor="#9CA3AF"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              !inputText.trim() && styles.sendButtonDisabled,
            ]}
            onPress={handleSendMessage}
            disabled={!inputText.trim() || isTyping}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={
                inputText.trim()
                  ? ["#4285F4", "#34A853"]
                  : ["#E5E7EB", "#E5E7EB"]
              }
              style={styles.sendButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons
                name="send"
                size={20}
                color={inputText.trim() ? "#fff" : "#9CA3AF"}
              />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 60 : 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    marginLeft: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "500",
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
    paddingBottom: 10,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#4285F4",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 6,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    paddingHorizontal: 30,
    lineHeight: 22,
    marginBottom: 30,
  },
  exampleContainer: {
    width: "100%",
    paddingHorizontal: 20,
  },
  exampleBubble: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  exampleText: {
    fontSize: 15,
    color: "#4285F4",
    fontWeight: "600",
  },
  messageBubble: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "flex-start",
  },
  userBubble: {
    justifyContent: "flex-end",
  },
  aiBubble: {
    justifyContent: "flex-start",
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E8F0FE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  messageContent: {
    maxWidth: "75%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
  },
  userMessageContent: {
    backgroundColor: "#4285F4",
    borderBottomRightRadius: 4,
    shadowColor: "#4285F4",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  aiMessageContent: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 4,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  userMessageText: {
    color: "#fff",
  },
  aiMessageText: {
    color: "#1F2937",
  },
  typingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4285F4",
    marginHorizontal: 3,
  },
  inputContainer: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#F3F4F6",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1F2937",
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    marginLeft: 8,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
