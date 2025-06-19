import { Link } from "expo-router";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Help = () => {
    return (
        <SafeAreaView className="flex flex-col gap-4 m-2">
            <View className="flex flex-col gap-4 p-2 justify-center items-center border-b border-2 border-gray-300 bg-gray-200">
                <Text className="text-center text-xl font-bold">Vous trouverez ici des informations concernant l’utilisation de la plateforme.</Text>
                <Text className="text-center">Cela comprend entre autres des petits manuels d’utilisation sur les différentes fonctionnalités complexes de l'application.</Text>
            </View>
            {/* Info congé */}
            <Link
                className="bg-blue-300 rounded-lg p-4"
                href={{
                    pathname: '/(tabs)/help/helpType',
                }}
            >
                <View className="flex flex-row justify-between items-center w-[100%] gap-8">
                    <Text className="text-white font-bold">Quel type de congé ?</Text>
                </View>
            </Link>
            {/* Formulaire */}
            <Link
                className="bg-blue-300 rounded-lg p-4"
                href={{
                    pathname: '/(tabs)/help/helpFormulaire',
                }}
            >
                <View className="flex flex-row justify-between items-center w-[100%] gap-8">
                    <Text className="text-white font-bold">Comment utiliser le formulaire ?</Text>
                </View>
            </Link>
            {/* Congés */}
            <Link
                className="bg-blue-300 rounded-lg p-4"
                href={{
                    pathname: '/(tabs)/help/helpHoliday',
                }}
            >
                <View className="flex flex-row justify-between items-center w-[100%] gap-8">
                    <Text className="text-white font-bold">On s'occupe des congés ?</Text>
                </View>
            </Link>
        </SafeAreaView>
    )
}

export default Help;