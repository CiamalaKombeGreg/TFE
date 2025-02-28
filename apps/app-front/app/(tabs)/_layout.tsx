import { Drawer } from "expo-router/drawer";

const tabs = {
  Accueil: "index",
  Profil: "users/[id]",
};

const DrawerLayout = () => {
  return (
    <>
      <Drawer>
        <Drawer.Screen
          name={tabs.Accueil}
          options={{
            drawerLabel: "Acceuil",
            title: "Accueil",
          }}
        />
        <Drawer.Screen
          name={tabs.Profil}
          options={{
            drawerLabel: "Profil",
            title: "Profil",
          }}
        />
      </Drawer>
    </>
  );
};

export default DrawerLayout;
