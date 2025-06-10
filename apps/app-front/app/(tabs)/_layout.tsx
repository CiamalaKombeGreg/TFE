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
  Image,
  Pressable,
  TouchableOpacity
} from "react-native";
import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {AuthResponse} from "@/lib/types";
import { useRouter } from "expo-router";


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
  idHoliday: "Requests/[id]",
  userList: "users/usersList",
  supervisor: "users/Supervisor",
};

const ValidateAuth = async (data: AuthResponse) => {
    const requestData = {
        email: data.user.email,
        nom: data.user.name,
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
    const response = await fetch(process.env.EXPO_PUBLIC_SERVER_URL+"/auth" || "http://localhost:3000/auth", settings);

    const fetchedData = await response.json();

    return fetchedData;
};

const DrawerLayout = () => {
  const [verifiedEmail, setVerifiedEmail] = React.useState<boolean>(false)

  const [userInfo, setUserInfo] = React.useState<AuthResponse | undefined>(undefined);

  const queryClient = useQueryClient();

  const links = Object.values(tabs);

  const router = useRouter();

  /* ---------------------------- AUTHENTICATION ---------------------------- */

  if(!GOOGLE_ANDROID_KEY || !GOOGLE_IOS_KEY){
    throw new Error("Missing google keys.")
  }

    const mutation = useMutation({
        mutationFn: ValidateAuth,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            setVerifiedEmail(true)
        },
        onError: (data) => {
            console.log("Error : "+ data);
            // Error page
        }
    });

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
        mutation.mutate(response.data)
        setUserInfo(response.data)
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
      setVerifiedEmail(false); // Remember to remove the user from your app's state as well
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
    
    /* ------------------------- CUSTOM DRAWER ------------------------- */

    const CustomDrawerContent = () => {
      return (
        <View className="flex-1 justify-between">
          <View>
            <Image
                className="h-32 w-32 rounded-full object-cover self-center mt-8"
                source={require('../../assets/images/Getaway logo.png')}
                alt="Profile Picture"
              />
          </View>
          <View>
            <TouchableOpacity onPress={() => router.push({pathname : "/(tabs)"})}>
              <View className="bg-[#03a4c3] m-2 p-4 rounded-3xl">
                <Text className="text-white text-xl"> Accueil </Text>
              </View>
            </TouchableOpacity>

            <Text className="text-center text-white text-lg"> ────────  Utilisateurs  ────────</Text>

            <TouchableOpacity onPress={() => router.push({pathname : "/(tabs)/users/usersList"})}>
              <View className="bg-[#03a4c3] m-2 p-4 rounded-3xl">
                <Text className="text-white text-xl"> Organisation </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push({pathname : "/(tabs)/users/Supervisor"})}>
              <View className="bg-[#03a4c3] m-2 p-4 rounded-3xl">
                <Text className="text-white text-xl"> Superviseurs </Text>
              </View>
            </TouchableOpacity>

            <Text className="text-center text-white text-lg"> ────────  Congés  ────────</Text>

            <TouchableOpacity onPress={() => router.push({pathname : "/(tabs)/form/dischargeRequest"})}>
              <View className="bg-[#03a4c3] m-2 p-4 rounded-3xl">
                <Text className="text-white text-xl"> Formulaire </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push({pathname : "/(tabs)/Requests/MyHolidays"})}>
              <View className="bg-[#03a4c3] m-2 p-4 rounded-3xl">
                <Text className="text-white text-xl"> Congés </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push({pathname : "/(tabs)/calendar/Calendar"})}>
              <View className="bg-[#03a4c3] m-2 p-4 rounded-3xl">
                <Text className="text-white text-xl"> Calendrier </Text>
              </View>
            </TouchableOpacity>
          </View>
        

          {/* Profile Button */}
            <TouchableOpacity onPress={() => router.push({pathname : "/(tabs)/users/user"})} className="ml-4">
              <Image
                className="h-16 w-16 rounded-full border-2 border-cyan-300 object-cover"
                src={userInfo?.user.photo ?? ""}
                alt="Profile Picture"
              />
              <Text className="opacity-0">Profil</Text>
            </TouchableOpacity>
        </View>
      )
    }

    /* ---------------------------- DISPLAY ---------------------------- */

  if(!verifiedEmail){
    return (
      <>
        <SafeAreaView className="flex flex-col bg-cyan-500 justify-center items-center h-full gap-4">
          {/* Photo */}
            <View className="flex items-center">
              <Image
                className="h-32 w-32 rounded-full object-cover"
                source={require('../../assets/images/Getaway logo.png')}
                alt="Profile Picture"
              />
            </View>
            <Text className="text-center text-white text-lg m-4 p-2">Votre équipe vous attend pour communiquer vos demandes !</Text>
          <TouchableOpacity className="flex justify-center items-center bg-cyan-700 m-2 p-2 w-[90%] rounded-xl" onPress={signIn}>
            <Text className="text-white">Se connecter avec @rush.be</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </>
    )
  }

  return (
    <>
      <Drawer
      drawerContent={() => CustomDrawerContent()}
      screenOptions={{
        headerStyle: {
          backgroundColor: '#00b8db',
        },
        headerTintColor: '#fff',
        drawerStyle: {
          backgroundColor: '#0097b4',
        },
        drawerLabelStyle: {
          color: '#fff',
          fontSize: 16,
          fontWeight: 'bold',
        },
      }}>
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
        <Drawer.Screen
          name={tabs.userList}
          options={{
            headerRight: () => <CustomHeader />,
            drawerLabel: "Organisation",
            title: "Organisation",
          }}
        />
        <Drawer.Screen
          name={tabs.supervisor}
          options={{
            headerRight: () => <CustomHeader />,
            drawerLabel: "Supervision",
            title: "Supervision",
          }}
        />
      </Drawer>
    </>
  );
};

export default DrawerLayout;
