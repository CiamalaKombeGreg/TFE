import MHCard from "@/components/element/MyHolidays/MHCard";
import { useGetHolidays } from "@/components/hooks/useGetHolidays";
import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthResponse, Holiday } from "@/lib/types";
import React, { useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { Picker } from "@react-native-picker/picker";
import { useGetUsers } from "@/components/hooks/useGetUsers";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

const MyHolidays = () => {
    // Fetched data
    const { data : users, isLoading: isUsersLoading  } = useGetUsers();
    const [list, setList] = useState<string | undefined>(); // Selected member
    const { data : holidays } = useGetHolidays()

    // Status hook
    const [status, setStatus] = useState<"ALL" | "ACCEPTER" | "REFUSER" | "ANALYSE" | "ANNULER">("ALL");

    // Authentification user
    const [userInfo, setUserInfo] = useState<AuthResponse | null>(null);

    const getCurrentUser = async () => {
        const currentUser = GoogleSignin.getCurrentUser() as AuthResponse;
        setUserInfo(currentUser);
    };
    
    React.useEffect(() => {
        getCurrentUser();
    }, [])

    // Sort on start date
    const orderHoliday = (firstDate : string, secondDate : string) => {
        if(new Date(firstDate) >= new Date(secondDate)){
            return 1
        }else{
            return -1
        }
    }

    if(isUsersLoading){
        return (
                    <SafeAreaView className="flex flex-col justify-content items-center"><ActivityIndicator /></SafeAreaView>
                )
    }else if(list === undefined){
        setList(users[0].pseudo)
    }else{
        return(
            <SafeAreaView className="flex flex-col items-center justify-center bg-gray-100 h-full w-full">
                {/* Title & selection */}
                <View className="flex w-full p-2 bg-gray-200">
                    <Text className="text-bold text-4xl m-2 text-center">Mes congés</Text>
                    {/* Tabs to select users & status */}
                    <View className="flex gap-4 z-10">
                        <View className="m-2">
                            <Text>Fonctionnaire : </Text>
                            <Picker
                                selectedValue={list}
                                onValueChange={(itemValue, itemIndex) =>
                                    {setList(itemValue)}
                                }>
                                {users.map((user) => (
                                    <Picker.Item key={user.email} label={user.pseudo} value={user.pseudo} />
                                ))}
                            </Picker>
                        </View>
                        <View className="m-2">
                            <Text>Statut : </Text>
                            <Picker
                                selectedValue={status}
                                onValueChange={(itemValue, itemIndex) =>
                                    {setStatus(itemValue)}
                                }>
                                {["ALL", "ACCEPTER", "REFUSER", "ANALYSE", "ANNULER"].map((status) => (
                                    <Picker.Item key={status} label={status} value={status} />
                                ))}
                            </Picker>
                        </View>
                    </View>
                </View>
    
                {/* Tableau */}
                <ScrollView>
                    <View className="flex flex-col items-stretch justify-start h-[80%] w-[90%] m-2 gap-2">
                        {typeof holidays === "object" && Array.isArray(holidays) && holidays?.sort((element_1 : Holiday, element_2 : Holiday) => orderHoliday(element_1.startDate, element_2.startDate))
                        .map((element: Holiday) =>
                               (element.status === status || status === "ALL") && <MHCard key={element.absId} id={element.absId} title={element.title} status={element.status} beginDate={new Date(element.startDate)} endDate={new Date(element.endDate)} />
                            )}
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}

export default MyHolidays;