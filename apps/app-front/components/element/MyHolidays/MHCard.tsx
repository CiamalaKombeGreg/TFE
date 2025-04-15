import { View, Text } from "react-native";

const MHCard = (data: {title: string, status: string, beginDate: Date, endDate: Date}) => {
    return (
        <View className="flex flex-row justify-around bg-gray-100 h-16">
            {/* Title */}
            <Text>{data.title}</Text>

            {/* Status */}
            <Text>{data.status}</Text>

            {/* Begin */}
            <Text>{data.beginDate.toDateString()}</Text>

            {/* End */}
            <Text>{data.endDate.toDateString()}</Text>
        </View>
    )
}

export default MHCard;