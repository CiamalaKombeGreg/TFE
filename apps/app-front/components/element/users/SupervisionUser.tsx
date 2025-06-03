import { UsersListModal } from "@/lib/types"
import { useState } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { useMutation, useQueryClient } from '@tanstack/react-query';
import classNames from 'classnames';

const changeUserRoles = async ({supervisorIdList, superviseId} : {supervisorIdList : string[], superviseId : string}) => {
    const requestData = {
        superviseId,
        supervisorIdList,
    };
  
    const settings = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
    };
    const response = await fetch(process.env.EXPO_PUBLIC_SERVER_URL+"/supervision/create" || "http://localhost:3000/supervision/create", settings);

    const fetchedData = await response.json();

    if(!fetchedData){
        console.log("Failure");
    }

    return fetchedData
}

export const SupervisionUser = ({isSuperAdmin ,userId, users, supervisorList} : {isSuperAdmin : boolean ,userId: string ,users : UsersListModal[], supervisorList : string[]}) => {

    // Button classnames
    const addButton = classNames({
        "rounded-lg p-3" : true,
        "bg-green-300 " : isSuperAdmin,
        "bg-gray-300" : !isSuperAdmin
    })

    const addText = classNames({
        "font-bold" : isSuperAdmin,
        "text-lime-800" : isSuperAdmin,
        "text-gray-500" : !isSuperAdmin,
    })

    const removeButton = classNames({
        "rounded-lg p-3" : true,
        "bg-red-300 " : isSuperAdmin,
        "bg-gray-300" : !isSuperAdmin
    })

    const removeText = classNames({
        "font-bold" : isSuperAdmin,
        "text-red-800" : isSuperAdmin,
        "text-gray-500" : !isSuperAdmin,
    })

    // Init supervisor list
    const initSupervisor = (supervisorList : string[]) => {
        const initList : {id: string, isSupervisor: boolean}[] = []
        for(const user of users){
            if(supervisorList.includes(user.id)){
                initList.push({id : user.id, isSupervisor : true})
                continue;
            }

            if(user.id !== userId){
                initList.push({id : user.id, isSupervisor : false})
            }
        }

        return initList
    }

    // List of supervisors
    const [currentSupervisors, setSupervisors] = useState<{id: string, isSupervisor: boolean}[]>(initSupervisor(supervisorList));
    const memo : {id: string, isSupervisor: boolean}[] = initSupervisor(supervisorList);

    // Query client
    const queryClient = useQueryClient();
    
    // Mutation to change roles
    const mutation = useMutation({
        mutationFn: changeUserRoles,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            console.log(data.message)
        },
        onError: () => {
            console.log("A fatal error occured.")
        }
    });

    // Update supervision
    const updateSupervision = () => {
        let isChanging = false;
        for(const current of memo){
            for(const next of currentSupervisors){
                if(next.id === current.id){
                    if(next.isSupervisor !== current.isSupervisor){
                        isChanging = true;
                    }
                }
            }
        }

        if(isChanging){
            const newSupervisor : string[] = [];
            for(const element of currentSupervisors){
                if(element.isSupervisor){
                    newSupervisor.push(element.id)
                }
            }
            mutation.mutate({supervisorIdList : newSupervisor, superviseId : userId})
        }
    }

    // Create current supervisor list
    const getCurrentSupervisor = (supervisor: {id: string, isSupervisor: boolean}) => {

        if(supervisor.isSupervisor){
            for(const user of users){
                if(user.id === supervisor.id){
                    return (
                        <View key={user.id} className="flex flex-row justify-between items-center gap-4 p-4">
                            <Text>{user.pseudo}</Text>
                            <TouchableOpacity disabled={!isSuperAdmin} className={removeButton} onPress={() => removeSupervisor(supervisor.id)}>
                                <Text className={removeText}>Retirer</Text>
                            </TouchableOpacity>
                        </View>
                    )
                }
            }
        }
    }

    // Display non-supervisor
    const getNonSupervisor = (supervisor : {id: string, isSupervisor: boolean}) => {

        if(!supervisor.isSupervisor){
            for(const user of users){
                if(user.id === supervisor.id){
                    return (
                        <View key={user.id} className="flex flex-row justify-between items-center gap-4 p-4">
                            <Text>{user.pseudo}</Text>
                            <TouchableOpacity disabled={!isSuperAdmin} className={addButton} onPress={() => addSupervisor(supervisor.id)}>
                                <Text className={addText}>Ajouter</Text>
                            </TouchableOpacity>
                        </View>
                    )
                }
            }
        }
    }

    // Add supervisor to the list
    const addSupervisor = (id : string) => {
        const newSupervisorList : {id: string, isSupervisor: boolean}[] = []
        for(const element of currentSupervisors){
            if (element.id === id){
                const newElement : {id: string, isSupervisor: boolean} = {id : element.id, isSupervisor : true};
                newSupervisorList.push(newElement);
            } else {
                newSupervisorList.push(element)
            }
        }
        setSupervisors(newSupervisorList)
    }

    // Remove supervisor to the list
    const removeSupervisor = (id : string) => {
        const newSupervisorList : {id: string, isSupervisor: boolean}[] = []
        for(const element of currentSupervisors){
            if (element.id === id){
                const newElement : {id: string, isSupervisor: boolean} = {id : element.id, isSupervisor : false};
                newSupervisorList.push(newElement);
            } else {
                newSupervisorList.push(element)
            }
        }
        setSupervisors(newSupervisorList)
    }

    return (
        <View>
            {/* Supervisor */}
            <View>
                <Text className="bg-green-300 p-4 rounded-xs">Liste des superviseurs</Text>
                {currentSupervisors.map((supervisor) => getCurrentSupervisor(supervisor))}
            </View>
            {/* Don't supervise */}
            <View>
                <Text className="bg-gray-300 p-4 rounded-xs">Ne supervise pas</Text>
                {currentSupervisors.map((supervisor) => getNonSupervisor(supervisor))}
            </View>
            <TouchableOpacity className="m-4 self-center w-[80%] bg-blue-300 rounded-lg p-3" onPress={() => updateSupervision()}>
                <Text className="text-cyan-800 font-bold text-center">Sauvegarder</Text>
            </TouchableOpacity>
        </View>
    )
}