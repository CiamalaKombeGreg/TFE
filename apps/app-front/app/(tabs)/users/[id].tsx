/*
 * Page pour afficher les profils d'utilisateurs
 */

import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

const ProfilPage = () => {
  const { id } = useLocalSearchParams<{ id: string }>(); //Take the parameters send from another element

  return (
    <View>
      <Text>Profil - {id}</Text>
    </View>
  );
};

export default ProfilPage;
