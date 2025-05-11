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
        if(role in newRoles){
            const index = newRoles.indexOf(role);
            if (index > -1) { 
                newRoles.splice(index, 1); // 
            }
        }else{
            newRoles.push(role)
        }

        setSelectedRoles(newRoles);
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
                        <Checkbox value={role in selectedRoles} onValueChange={() => changeRole(role)} />
                        <Text>{role}</Text>
                    </View>
                ))}
            </View>
            <View>
                {/* sauvegarder les changement */}
                <TouchableOpacity onPress={() => console.log("Save")}>
                    <Text>Sauvegarder</Text>
                </TouchableOpacity>

                {/* effacer les changements */}
                <TouchableOpacity onPress={() => console.log("Delete")}>
                    <Text>Quitter</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}