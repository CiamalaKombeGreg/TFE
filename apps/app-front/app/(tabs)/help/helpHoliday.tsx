import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HelpHoliday = () => {
    return (
        <SafeAreaView className="p-4 bg-white h-full">
          {/* Gestion des demandes */}
          <View className="mb-6">
            <Text className="text-xl font-semibold text-gray-800 mb-2">Gestion des demandes</Text>
            <Text className="text-gray-700 text-sm mb-1">
              Les utilisateurs peuvent modifier leurs demandes déjà envoyées. Dans l’onglet "Congé", les administrateurs peuvent consulter et gérer
              les demandes de tous les employés. Les superviseurs, comme les ressources humaines, peuvent répondre aux demandes de leurs subordonnés.
            </Text>
            <Text className="text-gray-700 text-sm mt-2 mb-1">Les demandes peuvent être filtrées selon leur statut :</Text>
            <Text className="text-gray-700 text-sm ml-2">• En analyse</Text>
            <Text className="text-gray-700 text-sm ml-2">• Acceptée</Text>
            <Text className="text-gray-700 text-sm ml-2">• Refusée</Text>
            <Text className="text-gray-700 text-sm ml-2">• Annulée</Text>
            <Text className="text-gray-700 text-sm mt-2">
              Un email est automatiquement envoyé aux personnes concernées lorsqu’une demande est soumise ou qu’une réponse est apportée.
            </Text>
            <Text className="text-gray-700 text-sm mt-8 font-semibold border-2 border-red-300 rounded-lg p-4">
              Remarque : Si une demande comprend un fichier joint, un lien de téléchargement sera affiché lors de sa consultation.
            </Text>
          </View>
        </SafeAreaView>
      );
}

export default HelpHoliday;