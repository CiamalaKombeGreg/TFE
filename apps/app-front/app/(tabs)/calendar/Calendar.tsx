import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import { useGetHolidays } from "@/components/hooks/useGetHolidays";

const CalendarHoliday = () => {

    const { data : holidays } = useGetHolidays()

    console.log(holidays)
    
    return <Calendar
                onDayPress={(day: any) => {
                console.log('selected day', day);
            }}
            />
}

export default CalendarHoliday;