import { View, Text, TouchableOpacity } from "react-native";
import { Link } from 'expo-router'

const MHCard = (data: {id: string, title: string, status: string, beginDate: Date, endDate: Date}) => {

    return (
            <View className="flex flex-row justify-around bg-gray-100 h-16">
                <Link href={{
                    pathname: '/Requests/[id]',
                    params: { id: data.id },
                }}>
                    {/* Title */}
                    <Text>{data.title}</Text>

                    {/* Status */}
                    <Text>{data.status}</Text>

                    {/* Begin */}
                    <Text>{data.beginDate.toDateString()}</Text>

                    {/* End */}
                    <Text>{data.endDate.toDateString()}</Text>
                </Link>
            </View>
    )
}

export default MHCard;