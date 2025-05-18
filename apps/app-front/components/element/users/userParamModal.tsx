import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native"
import Checkbox from 'expo-checkbox';
import { UsersListModal } from "@/lib/types";

type UserModalProps = {
    closeModal : any;
    setisModalOpen : any;
    user : UsersListModal;
    rolesList: string[];
}

export const UserModal = ({closeModal, setisModalOpen, user, rolesList} : UserModalProps ) => {
    const [selectedRoles, setSelectedRoles] = useState<string[]>(user.roles);

    const changeRole = (role: string) => {
        const newRoles = selectedRoles;
        if(role in newRoles){
            const index = newRoles.indexOf(role);
            if (index > -1) { 
                newRoles.splice(index, 1);
            }
        }else{
            newRoles.push(role)
        }

        setSelectedRoles(newRoles);
    }
    
    return (
        <View>
            <View className="fixed">
                <Text>{user.email}</Text>
                <Text>{user.pseudo}</Text>
                <Text>{user.roles}</Text>
            </View>
            <View>
                {rolesList.map((role) => (
                    <View id={role}>
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
                <TouchableOpacity onPress={() => {
                    closeModal(user)
                    setisModalOpen(false)
                }}>
                    <Text>Quitter</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}