import { GoogleSignin } from "@react-native-google-signin/google-signin";
import React, {useState} from "react";
import { AuthResponse } from "@/lib/types";
import {ActivityIndicator, Button, Image, Pressable, Text, View} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {useGetRoles} from "%/hooks/useGetRoles";
import {IsPlainObject} from "@/lib/isPlainObject";


const Role = {     SUPERADMIN: "SUPERADMIN",     RH: "RH",     DEV: "DEV",     STAGIAIRE: "STAGIAIRE",     COMPTABILITE: "COMPTABILITE" }

const UsersList = () => {
    const { data : roles, isError, isLoading } = useGetRoles();
    const [rolesArray, setRolesArray] = useState<object>([]);
    const [list, setList] = useState<string>("ALL");

    if(isLoading) {
        return (
            <SafeAreaView className="flex flex-col justify-content items-center"><ActivityIndicator /></SafeAreaView>
        )
    } else if (isError) {
        return (
            <View className="text-center p-5">
                <Text>Something went wrong</Text>
            </View>
        )
    } else {
        if (!IsPlainObject(roles)) {
            console.log("Received non-object")
        } else {
            const newRolesArray = Object.values(roles)
            setRolesArray(newRolesArray);
        }
    }

    return (
        <SafeAreaView>
            {/* Title */}
            <View>
                <Text>Every users</Text>
            </View>

            {/* Tabs to select enums */}
            <View>
                <Pressable onPress={() => setList("ALL")}>
                    <Text>ALL</Text>
                </Pressable>
                {Array.isArray(rolesArray) && rolesArray.map((role) => (
                    <Pressable onPress={() => setList(role)}>
                        <Text>{role}</Text>
                    </Pressable>
                ))}
            </View>

            {/* Filter AND/OR search bar */}

            {/* Display users */}
            <View>

            </View>
        </SafeAreaView>
    )
}

export default UsersList;