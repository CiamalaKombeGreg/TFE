import { View, Text, TouchableOpacity } from "react-native";
import { Link } from 'expo-router'
import classNames from "classnames";

const MHCard = (data: {id: string, title: string, status: string, beginDate: Date, endDate: Date}) => {

    // Styling of cards
    const cardStyle = classNames({
        "flex flex-col justify-center items-center rounded-lg shadow-xl m-4" : true,
        "bg-red-100 shadow-red-500" : data.status === "REFUSER",
        "bg-green-100 shadow-green-500" : data.status === "ACCEPTER",
        "bg-gray-400 shadow-gray-500" : data.status === "ANNULER",
        "bg-blue-100 shadow-blue-500" : data.status === "ANALYSE"
    })

    return (
        <Link 
                    className={cardStyle}
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