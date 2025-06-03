import React, { useState } from 'react';
import { ScrollView, View, Text, ActivityIndicator, SafeAreaView } from 'react-native';
import { Calendar, CalendarTheme, toDateId } from '@marceloterreiro/flash-calendar';
import { useGetBelgiumHolidays } from '@/components/hooks/useGetBelgiumHolidays';
import classNames from 'classnames';

const today = new Date();
const todayId = toDateId(today);

//Theme
const linearAccent = "#5043d1";

const linearTheme: CalendarTheme = {
  rowMonth: {
    content: {
      textAlign: "left",
      color: "rgba(255, 255, 255, 0.5)",
      fontWeight: "700",
    },
  },
  rowWeek: {
    container: {
      borderBottomWidth: 1,
      borderBottomColor: "rgba(255, 255, 255, 0.1)",
      borderStyle: "solid",
    },
  },
  itemWeekName: { content: { color: "rgba(255, 255, 255, 0.5)" } },
  itemDayContainer: {
    activeDayFiller: {
      backgroundColor: linearAccent,
    },
  },
  itemDay: {
    idle: ({ isPressed, isWeekend }) => ({
      container: {
        backgroundColor: isPressed ? linearAccent : "transparent",
        borderRadius: 4,
      },
      content: {
        color: isWeekend && !isPressed ? "rgba(255, 255, 255, 0.5)" : "#ffffff",
      },
    }),
    today: ({ isPressed }) => ({
      container: {
        borderColor: "rgba(255, 255, 255, 0.5)",
        borderRadius: isPressed ? 4 : 30,
        backgroundColor: isPressed ? linearAccent : "transparent",
      },
      content: {
        color: isPressed ? "#ffffff" : "rgba(255, 255, 255, 0.5)",
      },
    }),
    active: ({ isEndOfRange, isStartOfRange }) => ({
      container: {
        backgroundColor: linearAccent,
        borderTopLeftRadius: isStartOfRange ? 4 : 0,
        borderBottomLeftRadius: isStartOfRange ? 4 : 0,
        borderTopRightRadius: isEndOfRange ? 4 : 0,
        borderBottomRightRadius: isEndOfRange ? 4 : 0,
      },
      content: {
        color: "#ffffff",
      },
    }),
  },
};

// Generate every months (because Calendar.List have problem)
function generateMonthIds(start: Date, count: number): string[] {
  const months: string[] = [];

  for (let i = 0; i < count; i++) {
    const d = new Date(start.getFullYear(), start.getMonth() + i, 1);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    months.push(`${year}-${month}-01`); // "YYYY-MM"
  }

  return months;
}

// get disabled days (Because you don't work during saturday and sunday... right?)
function getDisabledWeekendIds(startDate: Date, months: number): string[] {
    const disabledDates: string[] = [];
  
    const date = new Date(startDate);
    date.setDate(1); // Start from the 1st of the month
  
    const endDate = new Date(date.getFullYear(), date.getMonth() + months, 0); // Last day of the range
  
    while (date <= endDate) {
      const day = date.getDay(); // 0 = Sunday, 6 = Saturday
      if (day === 0 || day === 6) {
        disabledDates.push(toDateId(new Date(date))); // Copy the date to avoid mutation bugs
      }
      date.setDate(date.getDate() + 1);
    }
  
    return disabledDates;
  }

const CalendarHoliday = () => {

    // Calendar data
    const [selectedDate, setSelectedDate] = useState(todayId);
    const [monthIds, setMonthsIds] = useState<string[]>(generateMonthIds(today, 12));
    const [disabledWeekends, setDisabledWeekends] = useState<string[]>(getDisabledWeekendIds(new Date(), 12));
    const {data : belgiumHoliday, isLoading} = useGetBelgiumHolidays('2025');

    //Classname of info
    const textClass = classNames({
        'text-white' : true,
    })

    if(isLoading){
        return <SafeAreaView className="flex flex-col justify-content items-center"><ActivityIndicator /></SafeAreaView>
    }else{
        return (
            <View className='flex bg-cyan-500'>
                <View className='self-center bg-cyan-700 w-[90%] rounded-lg p-4 m-4'>
                    <Text className={textClass}>Nom : </Text>
                    <Text className={textClass}>Date de début : </Text>
                    <Text className={textClass}>Date de fin : </Text>
                </View>
                <ScrollView>
                    <View className='bg-cyan-500 p-12 gap-4'>
                        {monthIds.map((monthId) => (
                        <View key={monthId} className='border-t border-blue-200 pt-6'>
                            <Calendar
                            calendarMonthId={monthId}
                            calendarDisabledDateIds={disabledWeekends}
                            theme={linearTheme}
                            calendarActiveDateRanges={[{ startId: selectedDate, endId: selectedDate }]}
                            onCalendarDayPress={setSelectedDate}
                            />
                        </View>
                        ))}
                    </View>
                </ScrollView>
            </View>
          );
    }
}

export default CalendarHoliday;