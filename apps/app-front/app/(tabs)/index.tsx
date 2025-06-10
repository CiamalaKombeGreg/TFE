import {ActivityIndicator, Button, Text, View} from "react-native";
import {
  GoogleSignin,
} from '@react-native-google-signin/google-signin';
import * as React from "react"
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { AuthResponse } from "@/lib/types";
import { useGetStatus } from "@/components/hooks/useGetStatus";
import { useGetBelgiumHolidays } from "@/components/hooks/useGetBelgiumHolidays";
import { toDateId } from "@marceloterreiro/flash-calendar";

const today = new Date();
const todayId = toDateId(today);

const indexDays = {
  "1" : "Lundi",
  "2" : "Mardi",
  "3" : "Mercredi",
  "4" : "jeudi",
  "5" : "Vendredi",
  "6" : "Samedi",
  "7" : "Dimanche",
}

const Index = () => {

  // Authentification user
  const [userInfo, setUserInfo] = useState<AuthResponse | null>(null);

  const getCurrentUser = () => {
      const currentUser = GoogleSignin.getCurrentUser() as AuthResponse;
      setUserInfo(currentUser);
  };
  
  React.useEffect(() => {
      getCurrentUser();
  }, [])

  // Current date
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  // Holiday in belgium
  const {data : belgiumHoliday, isLoading : currentLoading} = useGetBelgiumHolidays(`${new Date().getFullYear()}`);

  const [currentBelgiumHoliday, setCurrentBelgiumHoliday] = useState<string>("")

  // Update current date
  const changeDate = () => {
    if(Array.isArray(belgiumHoliday)){
      for(const element of belgiumHoliday){
        if(element.dateId === todayId){
          setCurrentBelgiumHoliday(element.name);
          return;
        }
      }
    }else{
      setCurrentBelgiumHoliday("Aucun congé");
    }
    setCurrentBelgiumHoliday("Aucun congé");
  }
  
  // Current status
  const {data : conge, isLoading} = useGetStatus(userInfo?.user.email || "");

  if(isLoading && currentLoading){
    return <SafeAreaView className="flex flex-col justify-content items-center"><ActivityIndicator /></SafeAreaView>
  }else if(currentBelgiumHoliday === ""){
    changeDate()
  }else{
    return (
      <SafeAreaView className="flex items-center w-full h-full">
          {/* Header (display current status) and holiday */}
          <View className="flex flex-col justify-center items-center gap-4 bg-cyan-200 rounded-lg w-[95%] h-[25%] m-2 p-2">
            {/* Date */}
            <Text className="text-gray-500 text-xl">{currentDate.toLocaleDateString()}</Text>
            {/* Week day */}
            <Text className="text-cyan-700 font-bold text-5xl">{indexDays[currentDate.getDay() as 1 | 2 | 3 | 4 | 5 | 6 | 7]}</Text>
            {/* Status */}
            {Array.isArray(conge) && conge.length > 0 && (conge.length > 1 ? <Text>Attention : Deux congés se superposent</Text> : <Text className="text-cyan-700 text-xl">Congé actuel : {conge[0].title}</Text>)}
            {Array.isArray(conge) && conge.length === 0 && <Text className="text-cyan-700 text-2xl">{currentBelgiumHoliday}</Text>}
          </View>
          {/* Liste of notifications (requests from the closest to the lastest without order of people) */}
      </SafeAreaView>
    );
  }
};

export default Index;
