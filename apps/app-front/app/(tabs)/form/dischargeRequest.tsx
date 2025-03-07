import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

const MyForm = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [comment, setComment] = useState("");
  const [type, setType] = useState("Choisir un type");

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const onChangeStartDate = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(Platform.OS === "ios");
    setStartDate(currentDate);
  };

  const onChangeEndDate = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || endDate;
    setShowEndDatePicker(Platform.OS === "ios");
    setEndDate(currentDate);
  };

  const handleSubmit = () => {
    // Envoyer les données du formulaire à votre serveur ici
    console.log("Date de début :", startDate.toLocaleDateString());
    console.log("Date de fin :", endDate.toLocaleDateString());
    console.log("Commentaire :", comment);
    console.log("Type :", type);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mon Formulaire</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          Date de début : {endDate.toDateString()}
        </Text>
        <Button
          title="Choisir une date"
          onPress={() => setShowStartDatePicker(true)}
        />
        {showStartDatePicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            is24Hour={true}
            onChange={onChangeStartDate}
          />
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          Date de fin : {startDate.toDateString()}
        </Text>
        <Button
          title="Choisir une date"
          onPress={() => setShowEndDatePicker(true)}
        />
        {showEndDatePicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            is24Hour={true}
            onChange={onChangeEndDate}
          />
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Commentaire :</Text>
        <TextInput
          style={styles.input}
          value={comment}
          onChangeText={setComment}
          placeholder="Entrez votre commentaire"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Type :</Text>
        <Picker
          selectedValue={type}
          style={styles.picker}
          onValueChange={(itemValue) => setType(itemValue)}
        >
          <Picker.Item label="Type 1" value="Type 1" />
          <Picker.Item label="Type 2" value="Type 2" />
          <Picker.Item label="Type 3" value="Type 3" />
        </Picker>
      </View>

      <Button title="Soumettre" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
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
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
  },
});

export default MyForm;
