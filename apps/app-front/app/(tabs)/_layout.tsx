import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import TabBar from "@/app/components/TabBar";

const TabsLayout = () => {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ tabBarActiveTintColor: "red" }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerTitle: "Accueil",
          title: "Accueil",
        }}
      />
      <Tabs.Screen
        name="users/[id]"
        options={{
          headerTitle: "Profil",
          title: "Profil",
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
