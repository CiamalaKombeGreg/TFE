import { useState } from "react";
import { TextInput, View, Text } from "react-native"

type DisplayTypeParameterProps = {
    id : string;
    remainingDay : string;
    typeList : {label : string, typeId : string}[];
    setNewRemainingDays : React.Dispatch<React.SetStateAction<{
        typeId: string;
        remainingDays: number;
    }[]>>;
    newRemainingDays : {typeId : string, remainingDays : number}[];

}

export const DisplayTypeParameter = ({id, remainingDay, typeList, setNewRemainingDays, newRemainingDays} : DisplayTypeParameterProps) => {
    // Hooks
    const [newValue, setNewValue] = useState<string | undefined>(remainingDay.toString());

    const getTypeLabel = () => {
        for(const type of typeList){
            if(type.typeId === id){
                return type.label
            }
        }
        return "Type inconnu";
    }

    const changeRemainingDays = (value : string) => {
        const newList : {typeId : string, remainingDays : number}[] = [];
        // Add new value
        if(value !== remainingDay.toString()){
            newList.push({typeId : id, remainingDays : parseInt(value)});
        }

        // Add the others type new values
        for(const element of newRemainingDays){
            if(element.typeId !== id){
                newList.push(element);
            }
        }

        setNewRemainingDays(newList);
    }

    return (
        <View className="flex flex-row gap-2 justify-between m-4 p-2 bg-gray-300 rounded-lg">
            <Text className="text-xs text-center mb-2">{getTypeLabel()}</Text>
            <View className="flex flex-row w-[50%] gap-4">
                <TextInput
                    className="bg-gray-500 text-white rounded-lg w-[25%] text-center"
                    editable={false}
                    keyboardType="numeric"
                    value={remainingDay.toString()}
                />
                <TextInput
                    className="bg-gray-100 rounded-lg w-[65%] text-center"
                    placeholder={"Limite de jours"}
                    keyboardType="numeric"
                    value={newValue}
                    onChangeText={(value) => {
                        if(parseInt(value) >= 0 && parseInt(value) <= 365){
                            setNewValue(parseInt(value).toString());
                            changeRemainingDays(parseInt(value).toString());
                        }else{
                            setNewValue(undefined);
                            changeRemainingDays("0");
                        }
                    }}
                />
            </View>
        </View>
    )
}