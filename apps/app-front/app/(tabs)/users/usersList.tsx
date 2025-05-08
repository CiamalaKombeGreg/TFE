import { GoogleSignin } from "@react-native-google-signin/google-signin";
import React from "react";
import { AuthResponse } from "@/lib/types";
import {Button, Image, Pressable, Text, View} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const UsersList = () => {
    return (
        <SafeAreaView>
            {/* Title */}
            <View>
                <Text>Every users</Text>
            </View>

            {/* Tabs to select enums */}
            <View>
                <Pressable onPress={() => {}}>
                    <Text></Text>
                </Pressable>
            </View>
        </SafeAreaView>
    )
}

export default UsersList;