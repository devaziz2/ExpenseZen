import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useState } from "react";
import { BottomNavigation, PaperProvider } from "react-native-paper";
import Home from "./Home";
import Profile from "./Profile";
import Reports from "./Reports";
import Wallet from "./Wallet";

export default function TabsLayout() {
  const [index, setIndex] = useState(0);

  const routes = [
    { key: "home", title: "Home", icon: "home-outline" },
    { key: "wallet", title: "Wallet", icon: "wallet-outline" },
    { key: "reports", title: "Reports", icon: "bar-chart-outline" },
    { key: "profile", title: "Profile", icon: "user" },
  ];

  const renderScene = BottomNavigation.SceneMap({
    home: Home,
    wallet: Wallet,
    reports: Reports,
    profile: Profile,
  });

  return (
    <PaperProvider>
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
        renderIcon={({ route, focused }) => {
          let IconComponent = Ionicons;
          let iconName = route.icon;

          if (route.key === "wallet") {
            IconComponent = MaterialCommunityIcons;
            iconName = "wallet-outline";
          } else if (route.key === "reports") {
            IconComponent = Ionicons;
            iconName = "bar-chart-outline";
          } else if (route.key === "profile") {
            IconComponent = FontAwesome5;
            iconName = "user";
          }

          return (
            <IconComponent
              name={iconName}
              size={24}
              color={focused ? "#1D3F69" : "gray"}
            />
          );
        }}
        labeled={false}
        activeColor="#1D3F69"
        inactiveColor="gray"
        barStyle={{
          backgroundColor: "#F5F5F5", // very light gray
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }}
      />
    </PaperProvider>
  );
}
