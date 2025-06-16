import { useGetAllowedHolidays } from "@/components/hooks/useGetAllowedHolidays";
import { useGetTypes } from "@/components/hooks/useGetTypes";
import { useGetUserById } from "@/components/hooks/useGetUserById";
import { useLocalSearchParams } from "expo-router";
import { View, Text, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const UserHolidaysParameter = () => {
    // Data
    const {id} = useLocalSearchParams<{ id: string }>();

    const {data : user, isLoading} = useGetUserById(id) as any;

    const {data : allowedHolidays, isLoading : allowedLoading } = useGetAllowedHolidays(id) as any;

    const { data: types, isError, isLoading : typeLoading } = useGetTypes();
    
    if(isLoading || allowedLoading || typeLoading){
        return <SafeAreaView className="flex flex-col justify-content items-center"><ActivityIndicator /></SafeAreaView>
    }else{
        return (
            <SafeAreaView>
                <View>
                    <Text className="text-3xl m-4">Paramètre</Text>
                </View>
                <View>
                    <Text>{id}</Text>
                    <Text>{user?.email}</Text>
                </View>
            </SafeAreaView>
        )
    }
}

export default UserHolidaysParameter;