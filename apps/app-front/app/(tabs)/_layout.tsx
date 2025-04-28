import { Drawer } from "expo-router/drawer";
import * as WebBrowser from "expo-web-browser";
import * as React from "react"
import { SafeAreaView } from "react-native-safe-area-context";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GOOGLE_ANDROID_KEY, GOOGLE_IOS_KEY, GOOGLE_WEB_KEY } from "@/lib/constants";
import {
  Button,
  Text,
  View,
  Pressable
} from "react-native";
import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {AuthResponse} from "@/lib/types";


WebBrowser.maybeCompleteAuthSession();

GoogleSignin.configure({
  webClientId: GOOGLE_WEB_KEY,
  scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
  offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  iosClientId: GOOGLE_IOS_KEY, // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
  profileImageSize: 120, // [iOS] The desired height (and width) of the profile image. Defaults to 120px
});

const tabs = {
  Accueil: "index",
  Profil: "users/user",
  Form: "form/dischargeRequest",
  Calendar: "calendar/Calendar",
  SelfHolidays: "Requests/MyHolidays",
  idHoliday: "Requests/[id]"
};

const ValidateAuth = async (data: AuthResponse) => {
    const requestData = {
        email: data.user.email,
        prenom: data.user.name,
        nom: data.user.familyName,
        token: data.idToken,
    };

    const settings = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
    };
    const response = await fetch(process.env.EXPO_PRIVATE_BASE_URL+"/auth" || "http://localhost:3000/auth", settings);

    const fetchedData = await response.json();

    console.log(fetchedData);

    return fetchedData;
};

const DrawerLayout = () => {
  const [userInfo, setUserInfo] = React.useState<AuthResponse | null>(null);

  const links = Object.values(tabs);

  /* ---------------------------- AUTHENTICATION ---------------------------- */

  if(!GOOGLE_ANDROID_KEY || !GOOGLE_IOS_KEY){
    throw new Error("Missing google keys.")
  }

    const mutation = useMutation({
        mutationFn: ValidateAuth,
        onSuccess: (data) => {
            console.log("Success : "+ data);
        },
        onError: (data) => {
            console.log("Error : "+ data);
        }
    });

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
          mutation.mutate(response.data)
        setUserInfo(response.data);
      } else {
        // sign in was cancelled by user
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            // operation (eg. sign in) already in progress
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            // Android only, play services not available or outdated
            break;
          default:
          // some other error happened
        }
      } else {
        // an error that's not related to google sign in occurred
      }
    }
  };

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      setUserInfo(null); // Remember to remove the user from your app's state as well
    } catch (error) {
      console.error(error);
    }
  };

    /* ---------------------------- HEADER ---------------------------- */

  const CustomHeader = () => {

    return (
      <View className="bg-blue-500 hover:bg-blue-700 py-2 px-4 m-2 rounded">
        <Pressable onPress={signOut}>
          <Text className="text-white font-bold">Sign Out</Text>
        </Pressable>
      </View>
    );
  };

    /* ---------------------------- DISPLAY ---------------------------- */

  if(!userInfo){
    return (
      <>
        <SafeAreaView>
          <Text>Authenticate with google</Text>
          <Button title="Sign in with Google" onPress={signIn} />
        </SafeAreaView>
      </>
    )
  }

  return (
    <>
      <Drawer>
        <Drawer.Screen
          name={tabs.Accueil}
          options={{
            headerRight: () => <CustomHeader />,
            drawerLabel: "Acceuil",
            title: "Accueil",
          }}
        />
        <Drawer.Screen
          name={tabs.Profil}
          options={{
            headerRight: () => <CustomHeader />,
            drawerLabel: "Profil",
            title: "Profil",
          }}
        />
        <Drawer.Screen
          name={tabs.Form}
          options={{
            headerRight: () => <CustomHeader />,
            drawerLabel: "Demander",
            title: "Demander",
          }}
        />
        <Drawer.Screen
          name={tabs.Calendar}
          options={{
            headerRight: () => <CustomHeader />,
            drawerLabel: "Calendrier",
            title: "Calendrier",
          }}
        />
        <Drawer.Screen
          name={tabs.SelfHolidays}
          options={{
            headerRight: () => <CustomHeader />,
            drawerLabel: "Mes congés",
            title: "Mes congés",
          }}
        />
        <Drawer.Screen
          name={tabs.idHoliday}
          options={{
            headerRight: () => <CustomHeader />,
            drawerLabel: "Congé spécifique",
            drawerItemStyle: {display: 'none'},
            title: "Congé spécifique",
          }}
        />
      </Drawer>
    </>
  );
};

export default DrawerLayout;
