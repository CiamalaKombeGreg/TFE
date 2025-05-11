import React, {useState} from "react";
import {ActivityIndicator, Button, Image, Pressable, Text, TouchableOpacity, View} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {useGetRoles} from "%/hooks/useGetRoles";

import { useGetUsers } from "@/components/hooks/useGetUsers";
import { UserModal } from "@/components/element/users/userParamModal";

const UsersList = () => {
    const { data : roles, isLoading: isRolesLoading } = useGetRoles();
    const [list, setList] = useState<string>("ALL");
    const { data : users, isLoading: isUsersLoading  } = useGetUsers(list);
    const [info, setInfo] = useState<{email: string, pseudo: string, roles: string[]} | undefined>(undefined);

    

    if(isRolesLoading || isUsersLoading) {
        return (
            <SafeAreaView className="flex flex-col justify-content items-center"><ActivityIndicator /></SafeAreaView>
        )
    } else {
        const rolesArray = Object.keys(roles as object)
        return (
            <SafeAreaView>
                {/* Title */}
                <View>
                    <Text>Every users</Text>
                </View>

                {/* Tabs to select enums */}
                <View className="flex flex-row flex-wrap gap-8 justify-center items-center">
                    <Pressable onPress={() => setList("ALL")}>
                        <Text>ALL</Text>
                    </Pressable>
                    {Array.isArray(rolesArray) && rolesArray.map((role) => (
                        <Pressable onPress={() => setList(role)}>
                            <Text>{role}</Text>
                        </Pressable>
                    ))}
                </View>

                {/* Display users */}
                <View>
                    {Array.isArray(users) && users.map((user) => (
                        <View>
                            <Text>{user?.pseudo}</Text>
                            <Text>{user?.email}</Text>
                            <TouchableOpacity onPress={() => setInfo({email: user?.email, pseudo: user?.pseudo, roles: user?.role})}><Text>Paramètre</Text></TouchableOpacity>
                        </View>
                    ))}
                </View>
                {info !== undefined && <UserModal email={info.email} pseudo={info.pseudo} roles={info.roles} rolesList={roles as string[]} />}
            </SafeAreaView>
        )
    }
}

export default UsersList;