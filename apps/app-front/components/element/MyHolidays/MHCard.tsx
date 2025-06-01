import { View, Text, TouchableOpacity } from "react-native";
import { Link } from 'expo-router'

const MHCard = (data: {id: string, title: string, status: string, beginDate: Date, endDate: Date}) => {

    return (
        <Link 
                    className="flex flex-col justify-center items-center bg-red-100"
                    href={{
                    pathname: '/Requests/[id]',
                    params: { id: data.id },
        }}>
            <View className="flex flex-col justify-center gap-1 p-4 w-[100%]">
                    {/* Title */}
                    <Text>Titre : {data.title}</Text>

                    {/* Status */}
                    <Text>Statut : {data.status}</Text>

                    {/* Begin */}
                    <Text>Date de commencement : {data.beginDate.toLocaleDateString()}</Text>

                    {/* End */}
                    <Text>Date de fin : {data.endDate.toLocaleDateString()}</Text>
            </View>
        </Link>
    )
}

export default MHCard;