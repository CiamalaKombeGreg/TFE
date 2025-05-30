import { useGetUsers } from "@/components/hooks/useGetUsers";
import { ActivityIndicator, SafeAreaView, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { AuthResponse } from "@/lib/types";
import React, { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { UsersListModal } from "@/lib/types";
import Checkbox from "expo-checkbox";

const Supervisor = () => {
    // Fetched data
    const { data : users, isLoading: isUsersLoading  } = useGetUsers();
    const [list, setList] = useState<string | undefined>(); // Selected member

    // Authentification user
    const [userInfo, setUserInfo] = useState<AuthResponse | null>(null);
    const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(false);
        
    const getCurrentUser = async () => {
        const currentUser = GoogleSignin.getCurrentUser() as AuthResponse;
        setUserInfo(currentUser);
    };
    
    React.useEffect(() => {
        getCurrentUser();
    }, [])

    // Selected supervisor
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

    if(isUsersLoading || !userInfo){
         return (
                    <SafeAreaView className="flex flex-col justify-content items-center"><ActivityIndicator /></SafeAreaView>
                )
    }else{
        for(let element of users){
            if(element.email === userInfo?.user.email){
                if(element.roles.includes("SUPERADMIN")){
                    setIsSuperAdmin(true);
                }
            }
        }
        return (
            <ScrollView>
                {/* Title */}
                <View className="z-10">
                    <Text className="text-3xl p-4">Supervision</Text>
                </View>
    
                {/* Tabs to select enums */}
                <View className="z-10">
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
            </ScrollView>
        )
    }
}

export default Supervisor;