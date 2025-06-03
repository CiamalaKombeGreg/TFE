/*
 * Page pour afficher les profils d'utilisateurs
 */

import { GoogleSignin } from "@react-native-google-signin/google-signin";
import React from "react";
import { AuthResponse } from "@/lib/types";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ProfilPage = () => {
  const [userInfo, setUserInfo] = React.useState<AuthResponse | null>(null);
  
  const getCurrentUser = async () => {
    const currentUser = GoogleSignin.getCurrentUser() as AuthResponse;
    setUserInfo(currentUser);
  };

  React.useEffect(() => {
    getCurrentUser();
  }, [])

  if (!userInfo) {
    return <Text>Loading...</Text>; // Or a more elaborate loading state
  }

  return (
    <SafeAreaView className="flex flex-col items-center justify-start min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <View className="max-w-md w-full space-y-8">
        {/* Photo */}
        <View className="flex items-center">
          <Image
            className="h-32 w-32 rounded-full object-cover"
            src={userInfo.user.photo ?? ""}
            alt="Profile Picture"
          />
        </View>

        {/* Details */}
        <View className="mt-6 space-y-6">
          <View>
            <Text className="text-center text-3xl font-extrabold text-gray-900">
              {userInfo.user.name}
            </Text>
          </View>

          <View className="rounded-md shadow-sm -space-y-px">
            <View className="relative">
              <View className="block w-full px-3 py-2 rounded-md border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                <Text className="text-gray-500">Email: {userInfo.user.email}</Text>
              </View>
            </View>

            <View className="relative">
              <View className="block w-full px-3 py-2 rounded-md border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                <Text className="text-gray-500">Prénom: {userInfo.user.givenName}</Text>
              </View>
            </View>

            <View className="relative">
              <View className="block w-full px-3 py-2 rounded-md border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                <Text className="text-gray-500">Nom de famille: {userInfo.user.familyName}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProfilPage;
