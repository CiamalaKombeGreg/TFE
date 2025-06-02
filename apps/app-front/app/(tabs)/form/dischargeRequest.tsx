import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  Button,
  StyleSheet,
  Platform,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useGetTypes } from "@/components/hooks/useGetTypes";
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthResponse } from "@/lib/types";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { getIdByEmail } from "@/lib/getIdByEmail";
import * as DocumentPicker from 'expo-document-picker';
import { ScrollView } from "react-native-gesture-handler";

const newRequest = async (data: { title: string; startDate: Date; endDate: Date; comment: string; type: string; email: string, file: DocumentPicker.DocumentPickerResult | null }) => {
  const id = await getIdByEmail(data.email);
  let fileKey: string | null = null;

    //Sending file (if there is one)
    if(data.file !== null && data.file?.assets !== null){
      const file = data.file.assets[0];
      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        name: file.name,
        type: file.mimeType || 'application/octet-stream',
      } as any);
  
      const responseFile = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const result = await responseFile.json();

      if(responseFile){
        fileKey = result.fileKey as string;
      }
    }

    // sending the data
    const requestData = {
      title: data.title,
      startDate: data.startDate,
      endDate: data.endDate,
      commentaire: data.comment,
      typeId: data.type,
      personnelId: id,
      fileKey
    };

    const settings = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      };
    const response = await fetch(process.env.EXPO_PUBLIC_SERVER_URL+"/absences" || "http://localhost:3000/absences", settings);

    const fetchedData = await response.json();

    if(fetchedData){
      return("Success")
    }else{
      return("Failure")
    }

};

const DischargeRequest = () => {
  // On récupère l'utilisateur
  const [userInfo, setUserInfo] = React.useState<AuthResponse | null>(null);
    
    const getCurrentUser = async () => {
      const currentUser = GoogleSignin.getCurrentUser() as AuthResponse;
      setUserInfo(currentUser);
    };
  
    React.useEffect(() => {
      getCurrentUser();
    }, [])

  // Données à soumettre
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [comment, setComment] = useState<string>("");
  const [type, setType] = useState<string>("None");
  const [title, setTitle] = useState<string>("");

  // Fetch
  const {data: types, isError,isLoading, error} = useGetTypes();

  // Query client
  const queryClient = useQueryClient();

  // Date picker affichage
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);


  // Mauvais encodage
  const wrongStartDate = () =>
      Alert.alert('La date est mauvaise', 'Votre date de retour est ultérieur à votre date de commencement.', [
          {text: "J'ai comrpis"},
      ]
  );

  const noType = () =>
    Alert.alert('Aucun type selectionné', 'Vous devez sélectionner un type de congé.', [
        {text: "J'ai comrpis"},
    ]
);

  //Changé la date de début
  const onChangeStartDate = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(Platform.OS === "ios");
    setStartDate(currentDate);
  };

  // Changé la date de fin
  const onChangeEndDate = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || endDate;
    setShowEndDatePicker(Platform.OS === "ios");
    setEndDate(currentDate);
  };

  // Get document
  const [file, setFile] = useState<DocumentPicker.DocumentPickerResult | null>(null);

  const getFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf','image/*'],
      copyToCacheDirectory : true,
    });

    if (!result.canceled) {
      const file = result.assets[0];
      setFile(result);
    }
  }

  // Soumission
  const handleSubmit = () => {
    // testing types
    if(type === "None"){
      noType();
      return 0
    }

    if(startDate > endDate){
      wrongStartDate();
      return 0
    }

    // Envoyer les données du formulaire à votre serveur ici
    if(userInfo !== null){
      mutation.mutate({ title, startDate, endDate, comment, type, email: userInfo.user.email, file });
    }

    // Vider les champs après la soumission
    setTitle('');
    setStartDate(new Date());
    setEndDate(new Date());
    setComment('');
    setType("None");
    setFile(null);
  };
  

  // Mutation
   const mutation = useMutation({
        mutationFn: newRequest,
        onSuccess: (data: string) => {
          console.log(data)
            queryClient.invalidateQueries({ queryKey: ["holidays"] });
        },
    });

  if(isLoading){
    return <SafeAreaView className="flex flex-col justify-content items-center"><ActivityIndicator /></SafeAreaView>
  }else{
    return (
      <ScrollView>
        <SafeAreaView style={styles.container}>
          <Text style={styles.title}>Mon Formulaire</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Titre :</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Entrez le titre"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Date de début : {startDate.toLocaleDateString()}</Text>
            <Button title="Choisir une date" onPress={() => setShowStartDatePicker(true)} />
            {showStartDatePicker && (
              <DateTimePicker
                value={startDate}
                mode="date"
                is24Hour={true}
                onChange={onChangeStartDate}
                style={styles.datePicker} // Style pour le DateTimePicker
              />
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Date de fin : {endDate.toLocaleDateString()}</Text>
            <Button title="Choisir une date" onPress={() => setShowEndDatePicker(true)} />
            {showEndDatePicker && (
              <DateTimePicker
                value={endDate}
                mode="date"
                is24Hour={true}
                onChange={onChangeEndDate}
                style={styles.datePicker} // Style pour le DateTimePicker
              />
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Commentaire :</Text>
            <TextInput
              style={styles.input}
              value={comment}
              onChangeText={setComment}
              placeholder="Entrez votre commentaire"
            />
          </View>

          <View>
            <Text style={styles.label}>Type :</Text>
            <Picker
                selectedValue={type}
                style={styles.picker}
                onValueChange={(itemValue) => setType(itemValue)}
              >
                <Picker.Item label="Selectionnez un type" value="None"/>
                {!isLoading && Array.isArray(types) && !isError ? (
                        types.length && (
                            types.map((type: {label: string, typeId: string}) => (
                                <Picker.Item key={type.typeId} label={type.label} value={type.typeId}/>
                            ))
                        )
                    ) : (<Picker.Item label="Aucun types trouvées..." value="" />)}
              </Picker>
          </View>

          {/* file selection */}
          <View className="flex flex-col items-center justify-center gap-4 m-8">
            {file === null &&
            <View>
              <Text className="text-xs text-gray-800 text-center m-2">Pensez à mettre un fichier si nécessaire (raisons médicales, preuves, etc.).</Text>
              <TouchableOpacity className="flex bg-gray-400 rounded-lg p-2 m-4" onPress={getFile}>
                <Text className="text-center text-white">Charger un pdf ou une image...</Text>
              </TouchableOpacity>
            </View>
            }
            {file && file.assets !== null && file.assets[0].mimeType?.startsWith('image/') && (
              <View className="bg-gray-300 h-[20em] w-[80%] m-4 border">
                <Image
                  source={{ uri: file.assets[0].uri }}
                  className="h-full w-full object-cover"
                />
                <TouchableOpacity className="absolute bg-red-500 rounded-lg p-2 m-2" onPress={() => setFile(null)}>
                  <Text className="text-center text-white">Remove</Text>
                </TouchableOpacity>
              </View>
            )}

            {file && file.assets !== null && file.assets[0].mimeType === 'application/pdf' && (
              <View className="flex flex-row flex-wrap justify-between items-center bg-gray-300 w-full border gap-2 p-2">
                <Text className="text-center text-xs">Picked PDF: {file.assets[0].name}</Text>
                <TouchableOpacity className="flex bg-red-500 rounded-lg p-2" onPress={() => setFile(null)}>
                  <Text className="text-center text-white">Remove</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          <Button title="Soumettre" onPress={handleSubmit} />
        </SafeAreaView>
      </ScrollView>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center', // Alignement du titre au centre
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    fontSize: 16, // Augmenter la taille de la police du champ de texte
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    fontSize: 16, // Augmenter la taille de la police du sélecteur
  },
  datePicker: {
    width: '100%', // Ajuster la largeur du DateTimePicker
  },
});

export default DischargeRequest;
