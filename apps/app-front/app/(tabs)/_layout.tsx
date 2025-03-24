import { Drawer } from "expo-router/drawer";

const tabs = {
  Accueil: "index",
  Profil: "users/[id]",
  Form: "form/dischargeRequest",
  Calendar: "calendar/Calendar"
};

const DrawerLayout = () => {
  const links = Object.values(tabs);
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
        <Drawer.Screen
          name={tabs.Form}
          options={{
            drawerLabel: "Demander",
            title: "Demander",
          }}
        />
        <Drawer.Screen
          name={tabs.Calendar}
          options={{
            drawerLabel: "Calendrier",
            title: "Calendrier",
          }}
        />
      </Drawer>
    </>
  );
};

export default DrawerLayout;
