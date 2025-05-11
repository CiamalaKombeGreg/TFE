import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native"
import Checkbox from 'expo-checkbox';

type UserModalProps = {
    email: string;
    pseudo: string;
    roles: string[];
    rolesList: string[];
}

export const UserModal = ({email, pseudo, roles, rolesList} : UserModalProps ) => {
    const [selectedRoles, setSelectedRoles] = useState<string[]>(roles);

    const changeRole = (role: string) => {
        const newRoles = selectedRoles;
    }
    
    return (
        <View>
            <View className="fixed">
                <Text>{email}</Text>
                <Text>{pseudo}</Text>
                <Text>{roles}</Text>
            </View>
            <View>
                {rolesList.map((role) => (
                    <View>
                        <Checkbox value={false} onValueChange={() => changeRole(role)} />
                        <Text>Normal checkbox</Text>
                    </View>
                ))}
            </View>
        </View>
    )
}