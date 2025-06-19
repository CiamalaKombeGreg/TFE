import { DisplayTypeParameter } from "@/components/element/users/DisplayTypeParameter";
import { useGetAllowedHolidays } from "@/components/hooks/useGetAllowedHolidays";
import { useGetTypes } from "@/components/hooks/useGetTypes";
import { useGetUserById } from "@/components/hooks/useGetUserById";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View, Text, ActivityIndicator, Button } from "react-native"
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context"

const changeLimit = async (data : {
    personnelId: string;
    allowedHolidays: {
      remainingDays: number;
      typeId: string;
    }[]}) => {
    const settings = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    };

    const response = await fetch(process.env.EXPO_PUBLIC_SERVER_URL+"/allowed" || "http://localhost:3000/allowed", settings);

    const fetchedData = await response.json();

    if(!fetchedData){
        console.log("Failure");
    }

    return fetchedData
}

const UserHolidaysParameter = () => {
    // Data
    const {id} = useLocalSearchParams<{ id: string }>();

    const { data : user, isLoading} = useGetUserById(id) as any;

    const { data: types, isLoading : typeLoading } = useGetTypes() as {data : {label : string, typeId : string}[], isLoading : boolean};

    const { data : allowedHolidays, isLoading : allowedLoading } = useGetAllowedHolidays(id) as any;

    // Query client
    
    const queryClient = useQueryClient();

    // Mutation
   const mutation = useMutation({
    mutationFn: changeLimit,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["allowed", id] });
        queryClient.invalidateQueries({ queryKey: ["allowed", user?.email] });
    },
});

    // Hooks
    const [newRemainingDays, setNewRemainingDays] = useState<{typeId : string, remainingDays : number}[]>([]);

    // Submit
    const handleSubmit = () => {
        // We only change if there is actual changement
        if(newRemainingDays.length > 0){
            mutation.mutate({personnelId : id, allowedHolidays : newRemainingDays})
        }
    }

    // Sort type
    const sortType = (element1 : any, element2 : any) => {
        // Compare
        if(element1.remainingDays >= element2.remainingDays){
            return 1
        }else{
            return 0
        }
    }
    
    if(isLoading || allowedLoading || typeLoading){
        return <SafeAreaView className="flex flex-col justify-content items-center"><ActivityIndicator /></SafeAreaView>
    }else{
        return (
            <SafeAreaView>
                <ScrollView>
                    <View className="flex flex-row items-center justify-between m-4">
                        <View>
                            <Text className="text-xl">{user?.pseudo}</Text>
                            <Text>{user?.email}</Text>
                        </View>
                        <View>
                            <Button title="Changer" onPress={handleSubmit} />
                        </View>
                    </View>
                    {/* List of allowed holidays parameter */}
                    {allowedHolidays
                    .sort((element1 : any, element2 : any) => sortType(element1, element2))
                    .map((conge : any) => {
                        return <DisplayTypeParameter key={conge.typeId} id={conge.typeId} remainingDay={conge.remainingDays} typeList={types} setNewRemainingDays={setNewRemainingDays} newRemainingDays={newRemainingDays} />
                    })}
                </ScrollView>
            </SafeAreaView>
        )
    }
}

export default UserHolidaysParameter;