import { useGetRelatedHolidays } from "@/components/hooks/useGetRelatedHolidays";
import { AuthResponse } from "@/lib/types";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Picker } from "@react-native-picker/picker";
import React from "react";
import { useState } from "react";
import { View, Text, Alert, TextInput, Button, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CheckRepas = () => {
    // Authentification user
    const [userInfo, setUserInfo] = useState<AuthResponse | null>(null);

    const getCurrentUser = async () => {
        const currentUser = GoogleSignin.getCurrentUser() as AuthResponse;
        setUserInfo(currentUser);
    };
    
    React.useEffect(() => {
        getCurrentUser();
    }, [])
    
    // Fetched data
    const { data : users, isLoading: isUsersLoading  } = useGetRelatedHolidays(userInfo?.user.email || "");

    // Hooks for calcul
    const [user, setUser] = useState<string>('');
    const [amount, setAmount] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const [calculated, setCalculated] = useState<string>('0,00 €');

    function countHolidayPeriod(start: Date, end: Date): number {
    
        const realStart = start < end ? start : end;
        const realEnd = start < end ? end : start;

        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth();

        // Month boundaries
        const monthStart = new Date(currentYear, currentMonth, 1);
        const monthEnd = new Date(currentYear, currentMonth + 1, 0);

        // Overlapping period
        const rangeStart = realStart > monthStart ? realStart : monthStart;
        const rangeEnd = realEnd < monthEnd ? realEnd : monthEnd;

        if (rangeStart > rangeEnd) return 0;

        let count = 0;
        const current = new Date(rangeStart);

        while (current <= rangeEnd) {
            const day = current.getDay();
            if (day !== 0 && day !== 6) {
            count++;
            }
            current.setDate(current.getDate() + 1);
        }

        return count;
    }

    // Count active days in each months
    function countWeekdaysInMonth(year: number, month: number): number {
        let count = 0;
        const date = new Date(year, month, 1); // month is 0-based
        
        while (date.getMonth() === month) {
            const day = date.getDay(); // 0 = Sunday, 6 = Saturday
            if (day !== 0 && day !== 6) {
            count++;
            }
            date.setDate(date.getDate() + 1);
        }
        
        return count;
    }
      
      

    // Submit data
    const handleSubmit = () => {
        if (!user || !amount) {
            Alert.alert('Données manquantes', 'Remplissez toutes les champs.', [
            {text: "J'ai comrpis"},
        ]);
            return;
        }

        setLoading(true);

        // Variable for calcul
        let totalDays = 0;

        const totalMonthDays = countWeekdaysInMonth(new Date().getFullYear(), new Date().getMonth())

        // Calculate
        for(const fetchedUser of users){
            if(fetchedUser.pseudo === user){
                for(const conge of fetchedUser.conges){
                    if(conge.status === "ACCEPTER"){
                        const congeDay =  countHolidayPeriod(new Date(conge.endDate), new Date(conge.startDate));
                        console.log(congeDay);
                        totalDays += congeDay;
                    }
                }
                break;
            }
        }

        console.log(totalMonthDays)
        console.log(totalDays)

        const total = parseFloat(amount) * (totalMonthDays - totalDays);

        setCalculated(`${total.toFixed(2)} €`);

        setLoading(false);
    };

    if(isUsersLoading || users.length <= 0){
        return (
                <SafeAreaView className="flex flex-col justify-content items-center"><ActivityIndicator /></SafeAreaView>
            )
    }

    if(user === ''){
        setUser(users[0].pseudo)
    }

    return (
        <SafeAreaView className="flex flex-col justify-start items-center bg-cyan-500 h-full">
            {/* Calcul (user + number) */}
            <View className="flex m-8 p-4 bg-cyan-600 w-[70%] rounded-3xl">
                <Text className="text-lg text-center text-white mb-2">Utilisateur</Text>
                <Picker
                    selectedValue={user}
                    onValueChange={(itemValue, itemIndex) =>
                        {setUser(itemValue)}
                    }>
                    {users.map((user) => (
                        <Picker.Item key={user.email} label={user.pseudo} value={user.pseudo} />
                    ))}
                </Picker>

                <Text className="text-lg text-center text-white mb-2">Valeur</Text>
                <TextInput
                    className="border border-gray-300 text-white rounded px-4 py-2 w-full mb-4"
                    placeholder="Entrez le montant en €"
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={setAmount}
                />

                <Button title="Calculer" onPress={handleSubmit} />
            </View>

            {/* Result */}
            <View className="flex- justify-center items-center m-4 p-8 bg-cyan-800 w-[70%] border-2 rounded-3xl">
                {loading ? <ActivityIndicator /> : <Text className="text-white text-center">Total de chèque repas : {calculated} </Text>}
            </View>
        </SafeAreaView>
    )
}

export default CheckRepas;