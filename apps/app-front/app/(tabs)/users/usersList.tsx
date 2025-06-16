import React, {useEffect, useState} from "react";
import {ActivityIndicator, Button, Image, Pressable, Text, TouchableOpacity, View} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {Picker} from '@react-native-picker/picker';
import {useGetRoles} from "%/hooks/useGetRoles";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useRouter } from 'expo-router';

import { useGetUsers } from "@/components/hooks/useGetUsers";
import { UserModal } from "@/components/element/users/userParamModal";

import { UsersListModal } from "@/lib/types";
import { AuthResponse } from "@/lib/types";
import { ScrollView } from "react-native-gesture-handler";

const UsersList = () => {
    const { data : roles, isLoading: isRolesLoading } = useGetRoles();
    const [list, setList] = useState<string>("ALL");
    const { data : users, isLoading: isUsersLoading  } = useGetUsers();
    const [allModal, setAllModal] = useState<UsersListModal[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const router = useRouter();

    // Authentification user
    const [userInfo, setUserInfo] = React.useState<AuthResponse | null>(null);
    const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(false);
      
      const getCurrentUser = async () => {
        const currentUser = GoogleSignin.getCurrentUser() as AuthResponse;
        setUserInfo(currentUser);
      };
    
      React.useEffect(() => {
        getCurrentUser();
      }, [])

      // Refresh current
    const refresh = ({roles, email} : {roles : string[], email : string}) => {
        const initAllModal : UsersListModal[] = []
        for(let element of users){
            if(email === element.email){
                initAllModal.push({id : element.id ,email : element?.email, pseudo: element?.pseudo, roles: roles, isOpen: false, supervisor: element.supervisor, supervise: element.supervise})
            } else {
                initAllModal.push({id : element.id ,email : element?.email, pseudo: element?.pseudo, roles: element?.roles, isOpen: false, supervisor: element.supervisor, supervise: element.supervise})
            }
        }
        setAllModal(initAllModal)
    }

    // Return user if he has the selected role in list
    const getUser = ({user, rolesArray} : {user : UsersListModal, rolesArray : string[]}) => {
        if(user.roles.includes(list) || list === "ALL"){
            return (
                <View key={user?.email} className="flex flex-col w-[100%] p-4 items-center justify-center border">
                    <Text className="text-xl m-2">{user?.pseudo}</Text>
                    <View className="flex flex-row gap-8">
                        {!user.isOpen && <Text className="font-bold">{user?.email}</Text>}
                        {!user.isOpen && <TouchableOpacity className="bg-green-500 rounded-lg p-1" onPress={() => openModal(user)}><Text className="text-white font-bold">Rôles</Text></TouchableOpacity>}
                        {isSuperAdmin && !user.isOpen && <TouchableOpacity className="bg-gray-500 rounded-lg p-1" onPress={() => router.push({pathname: '/users/[id]', params: { id: user.id }})}><Text className="text-white font-bold">Limites</Text></TouchableOpacity>}
                        {user.isOpen && <UserModal currentViewer={userInfo?.user.email} isAdminViewer={isSuperAdmin} refresh={refresh} closeModal={openModal} setisModalOpen={setIsModalOpen} user={user} rolesList={rolesArray} />}
                    </View>
                </View>
            )
        }
    }

    // Open modal for display user
    const openModal = (item: UsersListModal | undefined) => {
        if(item === undefined){
            setAllModal(allModal.map((newItem) => generateNewModal({newItem : undefined, currentItem : newItem})))
            setIsModalOpen(false)
        } else {
            for(let element of allModal){
                if(element.email === item.email){
                    const newState : UsersListModal = {id : item.id ,email : item.email, pseudo: item.pseudo, roles: item.roles, isOpen: !item.isOpen, supervisor: item.supervisor, supervise: item.supervise}
                    setAllModal(allModal.map((newItem) => generateNewModal({newItem : newState, currentItem : newItem})))
                }
            }
            setIsModalOpen(true)
        }
    }

    // Generate the new modal to set the new element
    const generateNewModal = ({newItem, currentItem} : {newItem : UsersListModal | undefined, currentItem : UsersListModal}) => {
        if(newItem === undefined){
            currentItem.isOpen = false;
            return currentItem
        }
        if(currentItem.email !== newItem.email){
            currentItem.isOpen = false;
            return currentItem
        } else {
            return newItem
        }
    }

    // Init first modal state
    const initModal = (users: UsersListModal[]) => {
        setAllModal(users);
        for(let element of users){
            if(element.email === userInfo?.user.email){
                if(element.roles.includes("SUPERADMIN")){
                    setIsSuperAdmin(true);
                }
            }
        }
    }
    

    if(isRolesLoading || isUsersLoading || !userInfo) {
        return (
            <SafeAreaView className="flex flex-col justify-content items-center"><ActivityIndicator /></SafeAreaView>
        )
    } else {
        const rolesArray = Object.keys(roles as object)
        if(allModal.length === 0){
            initModal(users)
        }
        return (
            <ScrollView className="z-10 relative">
                {/* Title */}
                <View className="z-10">
                    <Text className="text-3xl p-4">Utilisateurs</Text>
                </View>

                {/* Tabs to select enums */}
                <View className="z-10">
                    <Picker
                        selectedValue={list}
                        onValueChange={(itemValue, itemIndex) =>
                            {setList(itemValue)
                            openModal(undefined)}
                        }>
                        <Picker.Item label="ALL" value="ALL" />
                        {Array.isArray(rolesArray) && rolesArray.map((role) => (
                            <Picker.Item key={role} label={role} value={role} />
                        ))}
                    </Picker>
                </View>

                {/* Display users */}
                <View className="fixed inset-0 bg-white/50 flex flex-col items-center justify-center z-50">
                    {allModal.map((user) => getUser({user, rolesArray}))}
                </View>
            </ScrollView>
        )
    }
}


export default UsersList;