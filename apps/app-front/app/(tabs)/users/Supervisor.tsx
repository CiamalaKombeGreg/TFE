import { useGetUsers } from "@/components/hooks/useGetUsers";
import { ActivityIndicator, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { AuthResponse } from "@/lib/types";
import React, { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { SupervisionUser } from "@/components/element/users/SupervisionUser";

const Supervisor = () => {
    // Fetched data
    const { data : users, isLoading: isUsersLoading  } = useGetUsers();
    const [list, setList] = useState<string | undefined>(); // Selected member

    // Authentification user
    const [userInfo, setUserInfo] = useState<AuthResponse | null>(null);
    const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(false);
    const [didVerifiedAdmin, setVerifiedAdmin] = useState<boolean>(false);
        
    const getCurrentUser = async () => {
        const currentUser = GoogleSignin.getCurrentUser() as AuthResponse;
        setUserInfo(currentUser);
    };
    
    React.useEffect(() => {
        getCurrentUser();
    }, [])

    // init array of supervisor
    const initSupervisor = (supervisorList : {superviseId: string ,superviseurId: string;}[]) => {
        const currentSupervisor : string[] = [];
        for(const element of supervisorList){
            currentSupervisor.push(element.superviseurId)
        }
        return currentSupervisor
    }

    // Selected supervisor
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

    if(isUsersLoading || !userInfo){
        
         return (
                    <SafeAreaView className="flex flex-col justify-content items-center"><ActivityIndicator /></SafeAreaView>
                )
    } else if (!didVerifiedAdmin){
        for(let element of users){
            if(element.email === userInfo?.user.email){
                if(element.roles.includes("SUPERADMIN")){
                    setIsSuperAdmin(true);
                }
            }
        }
        setVerifiedAdmin(true)
        setList(users[0].pseudo)
    } else {
        return (
            <ScrollView>
                {/* Title */}
                <View className="z-10">
                    <Text className="text-3xl p-4">Supervision</Text>
                </View>
    
                {/* Tabs to select users */}
                <View className="z-10">
                    <Picker
                        selectedValue={list}
                        onValueChange={(itemValue, itemIndex) =>
                            {setList(itemValue)}
                        }>
                        {users.map((user) => (
                            <Picker.Item key={user.email} label={user.pseudo +" : "+ user.email} value={user.pseudo} />
                        ))}
                    </Picker>
                </View>

                {/* Display supervision of user */}
                {users.map((user) => {
                    return user.pseudo === list && <SupervisionUser key={user.email} isSuperAdmin={isSuperAdmin} userId={user.id} users={users} supervisorList={initSupervisor(user.supervise)} />
                })}
            </ScrollView>
        )
    }
}

export default Supervisor;