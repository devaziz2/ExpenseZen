import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { PaperProvider } from "react-native-paper";
import Home from "./Home";
import Profile from "./Profile";
import Reports from "./Reports";
import Wallet from "./Wallet";

const { width } = Dimensions.get("window");

export default function TabsLayout() {
  const [activeTab, setActiveTab] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scaleAnims = useRef([
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1),
  ]).current;

  const tabs = [
    {
      key: "home",
      title: "Home",
      icon: "home-outline",
      component: Home,
      iconFamily: Ionicons,
    },
    {
      key: "wallet",
      title: "Wallet",
      icon: "wallet-plus-outline",
      component: Wallet,
      iconFamily: MaterialCommunityIcons,
    },
    {
      key: "reports",
      title: "Analytics",
      icon: "bar-chart-outline",
      component: Reports,
      iconFamily: Ionicons,
    },
    {
      key: "profile",
      title: "Profile",
      icon: "user",
      component: Profile,
      iconFamily: FontAwesome5,
    },
  ];

  const handleTabPress = (index) => {
    if (index === activeTab) return;

    // Animate slide transition
    Animated.timing(slideAnim, {
      toValue: index,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Animate button press
    Animated.sequence([
      Animated.timing(scaleAnims[index], {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnims[index], {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setActiveTab(index);
  };

  const renderContent = () => {
    const ActiveComponent = tabs[activeTab].component;
    return (
      <Animated.View
        style={[
          styles.contentContainer,
          {
            transform: [
              {
                translateX: slideAnim.interpolate({
                  inputRange: [0, 1, 2, 3],
                  outputRange: [0, -width, -width * 2, -width * 3],
                }),
              },
            ],
          },
        ]}
      >
        {tabs.map((tab, index) => (
          <View key={tab.key} style={styles.screenContainer}>
            <tab.component />
          </View>
        ))}
      </Animated.View>
    );
  };

  const renderTabButton = (tab, index) => {
    const isActive = activeTab === index;
    const IconComponent = tab.iconFamily;

    return (
      <TouchableOpacity
        key={tab.key}
        style={styles.tabButton}
        onPress={() => handleTabPress(index)}
        activeOpacity={0.7}
      >
        <Animated.View
          style={[
            styles.tabIconContainer,
            {
              transform: [{ scale: scaleAnims[index] }],
              backgroundColor: isActive ? "#E8F4FD" : "transparent",
            },
          ]}
        >
          <IconComponent
            name={tab.icon}
            size={22}
            color={isActive ? "#1D3F69" : "#8E8E93"}
          />
        </Animated.View>
        <Animated.Text
          style={[
            styles.tabLabel,
            {
              color: isActive ? "#1D3F69" : "#8E8E93",
              opacity: slideAnim.interpolate({
                inputRange: [index - 0.5, index, index + 0.5],
                outputRange: [0.6, 1, 0.6],
                extrapolate: "clamp",
              }),
            },
          ]}
        >
          {tab.title}
        </Animated.Text>

        {/* Active indicator dot */}
        {isActive && <View style={styles.activeIndicator} />}
      </TouchableOpacity>
    );
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        {/* Content Area */}
        <View style={styles.content}>{renderContent()}</View>

        {/* Custom Bottom Navigation */}
        <View style={styles.bottomNav}>
          <View style={styles.navContainer}>
            {tabs.map((tab, index) => renderTabButton(tab, index))}
          </View>

          {/* Animated background indicator */}
          <Animated.View
            style={[
              styles.backgroundIndicator,
              {
                transform: [
                  {
                    translateX: slideAnim.interpolate({
                      inputRange: [0, 1, 2, 3],
                      outputRange: [
                        width / 8 - 25,
                        (width * 3) / 8 - 25,
                        (width * 5) / 8 - 25,
                        (width * 7) / 8 - 25,
                      ],
                    }),
                  },
                ],
              },
            ]}
          />
        </View>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  content: {
    flex: 1,
    overflow: "hidden",
  },
  contentContainer: {
    flexDirection: "row",
    width: width * 4,
    height: "100%",
  },
  screenContainer: {
    width: width,
    flex: 1,
  },
  bottomNav: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 15,
    paddingBottom: Platform.OS === "ios" ? 25 : 15,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 15,
    position: "relative",
  },
  navContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 60,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    position: "relative",
  },
  tabIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: 2,
  },
  activeIndicator: {
    position: "absolute",
    bottom: -8,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#1D3F69",
  },
});
