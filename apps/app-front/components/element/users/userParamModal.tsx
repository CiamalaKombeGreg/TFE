import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native"
import Checkbox from 'expo-checkbox';
import { UsersListModal } from "@/lib/types";
import { useMutation, useQueryClient } from '@tanstack/react-query';

type UserModalProps = {
    currentViewer : string | undefined;
    isAdminViewer : boolean;
    refresh: ({roles, email} : {roles : string[], email : string}) => void;
    closeModal : any;
    setisModalOpen : any;
    user : UsersListModal;
    rolesList: string[];
}

const changeUserRoles = async ({email, roles} : {email : string, roles : string[]}) => {
    const requestData = {
        roles,
        email
    };
  
    const settings = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
    };
    const response = await fetch(process.env.EXPO_PUBLIC_SERVER_URL+"/personnel/roles" || "http://localhost:3000/personnel/roles", settings);

    const fetchedData = await response.json();

    if(!fetchedData){
        console.log("Failure");
    }

    return roles
}

export const UserModal = ({currentViewer, isAdminViewer, refresh, closeModal, setisModalOpen, user, rolesList} : UserModalProps ) => {
    const [selectedRoles, setSelectedRoles] = useState<string[]>(user.roles);

    const changeRole = (role: string) => {
        const newRoles : string[] = [];
        for(let element of selectedRoles){
            if(element !== role){
                newRoles.push(element);
            }
        }

        if(!(selectedRoles.includes(role))){
            newRoles.push(role)
        }

        setSelectedRoles(newRoles);
    }

    // Query client
        const queryClient = useQueryClient();
    
        // Mutation to change roles
        const mutation = useMutation({
            mutationFn: changeUserRoles,
            onSuccess: (data) => {
                queryClient.invalidateQueries({ queryKey: ["users"] });
                refresh({roles : data, email : user.email})
            },
        });
    
        const updateRoles = ({email, roles, currentRoles} : {email : string, roles : string[], currentRoles : string[]}) => {
            for(let element of roles){
                if(!(currentRoles.includes(element)) || roles.length !== currentRoles.length){
                    mutation.mutate({email, roles})
                    break;
                }
            }
        }
    
    
    return (
        <View className="flex justify-start rounded-lg bg-gray-200 w-[100%] h-[100%] p-2">
            <View className="flex flex-col justify-center items-center  p-4 gap-2">
                <Text className="font-bold">{user.email}</Text>
                <View className="flex flex-row flex-wrap justify-center items-center gap-4">{user.roles.map((role) => 
                <Text key={role} className="bg-blue-300 rounded-lg text-cyan-900 p-2">{role}</Text>
                )}</View>
            </View>
            <View className="flex flex-col justify-start m-4 gap-4">
                {rolesList.map((role) => (
                    <View key={role} className="flex flex-row justify-between">
                        <Text>{role} : </Text>
                        <Checkbox value={selectedRoles.includes(role)} onValueChange={() => changeRole(role)} disabled={!isAdminViewer}/>
                    </View>
                ))}
            </View>
            <View className="flex flex-row justify-center items-center gap-4">
                {/* sauvegarder les changement */}
                {isAdminViewer && <TouchableOpacity className="bg-lime-500 rounded-lg p-3" onPress={() => updateRoles({email : user.email, roles : selectedRoles, currentRoles : user.roles})}>
                    <Text className="text-green-800 font-bold">Sauvegarder</Text>
                </TouchableOpacity>}

                {/* effacer les changements */}
                <TouchableOpacity className="bg-red-300 rounded-lg p-3" onPress={() => {
                    closeModal(user)
                    setisModalOpen(false)
                }}>
                    <Text className="text-red-800 font-bold">Quitter</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}