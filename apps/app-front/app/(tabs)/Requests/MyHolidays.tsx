import MHCard from "@/components/element/MyHolidays/MHCard";
import { useGetHolidays } from "@/components/hooks/useGetHolidays";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Holiday } from "@/lib/types";
import React from "react";

const MyHolidays = () => {
    const { data : holidays } = useGetHolidays()

    return(
        <SafeAreaView className="flex flex-col items-center justify-center bg-gray-200 h-full w-full">
            {/* Title */}
            <View>
                <Text className="text-bold text-5xl p-2 m-2">Mes congés</Text>
            </View>

            {/* Tableau */}
            <View className="flex flex-col items-stretch justify-start bg-gray-400 h-[80%] w-[90%] m-2 rounded-xl shadow-xl border border-black">
                <Text className="text-white text-center bg-black rounded-t-xl h-8">Liste</Text>
                {typeof holidays === "object" && Array.isArray(holidays) && holidays?.map((element: Holiday) =>
                        <MHCard key={element.absId} title={element.title} status={element.status} beginDate={new Date(element.startDate)} endDate={new Date(element.endDate)} />
                    )}
            </View>
        </SafeAreaView>
    )
}

export default MyHolidays;