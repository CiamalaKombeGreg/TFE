import React, {useState} from "react";
import {ActivityIndicator, Button, Image, Pressable, Text, TouchableOpacity, View} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {useGetRoles} from "%/hooks/useGetRoles";

import { useGetUsers } from "@/components/hooks/useGetUsers";
import { UserModal } from "@/components/element/users/userParamModal";

import { UsersListModal } from "@/lib/types";

const UsersList = () => {
    const { data : roles, isLoading: isRolesLoading } = useGetRoles();
    const [list, setList] = useState<string>("ALL");
    const { data : users, isLoading: isUsersLoading  } = useGetUsers();
    const [allModal, setAllModal] = useState<UsersListModal[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    // Open modal for display user
    const openModal = (item: UsersListModal) => {
        for(let element of allModal){
            if(element.email === item.email){
                const newState : UsersListModal = {email : item.email, pseudo: item.pseudo, roles: item.roles, isOpen: !item.isOpen}
                setAllModal(allModal.map((newItem) => generateNewModal({newItem : newState, currentItem : newItem})))
            }
        }
        setIsModalOpen(true)
    }

    // Generate the new modal to set the new element
    const generateNewModal = ({newItem, currentItem} : {newItem : UsersListModal, currentItem : UsersListModal}) => {
        if(currentItem.email !== newItem.email){
            return currentItem
        } else {
            return newItem
        }
    }

    // Init first modal state
    const initModal = (users: unknown) => {
        const initAllModal : UsersListModal[] = []
        if(Array.isArray(users)){
            for(let element of users){
                initAllModal.push({email : element?.email, pseudo: element?.pseudo, roles: element?.role, isOpen: false})
            }
            setAllModal(initAllModal)
        }
    }
    

    if(isRolesLoading || isUsersLoading) {
        return (
            <SafeAreaView className="flex flex-col justify-content items-center"><ActivityIndicator /></SafeAreaView>
        )
    } else {
        const rolesArray = Object.keys(roles as object)
        if(allModal.length === 0){
            initModal(users)
        }
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
                    {allModal.map((user) => (
                        <View id={user?.email}>
                            <Text>{user?.pseudo}</Text>
                            <Text>{user?.email}</Text>
                            <TouchableOpacity onPress={() => openModal(user)}><Text>Paramètre</Text></TouchableOpacity>
                            {user.isOpen && <UserModal closeModal={openModal} setisModalOpen={setIsModalOpen} user={user} rolesList={rolesArray} />}
                        </View>
                    ))}
                </View>
            </SafeAreaView>
        )
    }
}


export default UsersList;