import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HelpFormulaire = () => {
    return (
        <SafeAreaView className="p-4 bg-white h-full">    
          {/* Informations générales */}
          <View className="mb-6">
            <Text className="text-2xl font-semibold text-gray-800 mb-2">Informations sur les demandes</Text>
            <Text className="text-gray-700 text-sm mb-1">Chaque demande de congé doit inclure les champs suivants :</Text>
            <Text className="text-gray-700 text-sm ml-2">• Un titre</Text>
            <Text className="text-gray-700 text-sm ml-2">• Une date de début</Text>
            <Text className="text-gray-700 text-sm ml-2">• Une date de fin</Text>
            <Text className="text-gray-700 text-sm ml-2">• Un commentaire</Text>
            <Text className="text-gray-700 text-sm ml-2">• Un type de congé</Text>
            <Text className="text-gray-700 text-sm ml-2">• Un fichier justificatif</Text>
            <Text className="text-gray-700 text-sm mt-2">
              Tous ces champs sont obligatoires. Cependant, pour les congés légaux, extra-légaux, sans solde ou en télétravail,
              le fichier justificatif n’est pas requis.
            </Text>
            <Text className="text-gray-500 text-xs mt-2">
                A noter qu'une demande ne peut pas chevaucher une période d’absence déjà existante. 
            </Text>
            <Text className="text-gray-700 text-sm mt-8 font-semibold border-2 border-red-300 rounded-lg p-4">
              Remarque :
              Si un employeur impose une limite, l’application ne la bloque pas mais vous envoie tout de même la demande.
            </Text>
          </View>
        </SafeAreaView>
      );
}

export default HelpFormulaire;