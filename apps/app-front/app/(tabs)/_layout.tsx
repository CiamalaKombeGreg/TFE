import { Tabs } from "expo-router";

const TabsLayout = () => {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{ headerTitle: "Home", title: "Home" }}
      />
      <Tabs.Screen
        name="users/[id]"
        options={{ headerTitle: "Profil", title: "Profil" }}
      />
    </Tabs>
  );
};

export default TabsLayout;
