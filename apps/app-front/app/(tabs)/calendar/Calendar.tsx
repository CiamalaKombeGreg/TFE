import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import { useGetHolidaysForCalendar } from "@/components/hooks/useGetHolidaysForCalendar";
import { useState } from "react";

const CalendarHoliday = () => {

    // Fetch the all corresponding holidays
    const { data : holidays } = useGetHolidaysForCalendar()

    const [selected, setSelected] = useState<string>("")

    let markedDates = {};

    if(typeof holidays === "object"){
        markedDates = {
        [selected]: { selected: true, disableTouchEvent: true, selectedColor: 'orange' },
        ...holidays 
    };
    }
    
    return (
        <SafeAreaView>
            <Calendar
                onDayPress={(day: any) => {
                    setSelected(day.dateString)
                }}
                style={{
                  borderWidth: 1,
                  borderColor: 'gray',
                  height: 400,  
                }}
                markedDates={markedDates}
            />
        </SafeAreaView>
    )
}

export default CalendarHoliday;