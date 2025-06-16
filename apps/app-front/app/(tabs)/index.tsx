import {ActivityIndicator, Button, Text, TextInput, View} from "react-native";
import {
  GoogleSignin,
} from '@react-native-google-signin/google-signin';
import * as React from "react"
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { AuthResponse, Holiday, UserRelatedAbsenceProps } from "@/lib/types";
import { useGetStatus } from "@/components/hooks/useGetStatus";
import { useGetBelgiumHolidays } from "@/components/hooks/useGetBelgiumHolidays";
import { toDateId } from "@marceloterreiro/flash-calendar";
import { useGetRelatedHolidays } from "@/components/hooks/useGetRelatedHolidays";
import { ScrollView } from "react-native-gesture-handler";
import { orderHoliday } from "./Requests/MyHolidays";
import MHCard from "@/components/element/MyHolidays/MHCard";

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

  // Verify if holiday is today
  const isTodayBetweenDates = (startStr: string, endStr: string): boolean => {
    const startDate = new Date(startStr);
    const endDate = new Date(endStr);
  
    // Get only the date parts (year, month, day)
    const today = new Date();
    const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startDateOnly = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const endDateOnly = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
  
    return todayDateOnly >= startDateOnly && todayDateOnly <= endDateOnly;
  };

  // Create element display of holidays for the header
  const setCurrentPersonnalHoliday = (element : Holiday) => {
    if(isTodayBetweenDates(element.startDate, element.endDate)){
      return <Text key={element.absId} className="text-cyan-700 text-2xl">{element.title}</Text>
    }
  }

  // Search bar
  const [search, setSearch] = useState<string>("")

  const setNotification = ({email} : {email : string}) => {
    if(email !== userInfo?.user.email){
      
    }
  }
  
  // Current status
  const {data : conge, isLoading} = useGetStatus(userInfo?.user.email || "");

  // Related holiday
  const { data : users, isLoading: isUsersLoading  } = useGetRelatedHolidays(userInfo?.user.email || "");

  if(isLoading && currentLoading && isUsersLoading){
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
            {Array.isArray(conge) && conge.map((element) => setCurrentPersonnalHoliday(element))}
            {todayId === currentBelgiumHoliday && <Text className="text-cyan-700 text-2xl">{currentBelgiumHoliday}</Text>}
          </View>
          {/* Liste of notifications */}
          <View className='w-11/12 mx-auto my-8'>
            <Text className="text-lg text-gray-700 mb-1">Filtre</Text>
            <TextInput
            onChangeText={setSearch}
              className='bg-white border border-gray-300 rounded-xl px-4 py-3 text-base shadow-sm'
              placeholderTextColor="#999"
              placeholder="Rechercher"
            />
          </View>
          <ScrollView>
            <View>
            {users.map((user) => 
                user.conges.sort((element_1, element_2) => orderHoliday(element_1.startDate, element_2.startDate))
                .map((element) =>
                        (element.status === "ANALYSE") && (element.title.includes(search) || search === "") && <MHCard key={element.absId} id={element.absId} title={element.title} status={element.status} beginDate={new Date(element.startDate)} endDate={new Date(element.endDate)} />
                    )
            )}
            </View>
          </ScrollView>
      </SafeAreaView>
    );
  }
};

export default Index;
