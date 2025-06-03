import { toDateId } from "@marceloterreiro/flash-calendar";
import {useQuery, UseQueryOptions} from "@tanstack/react-query";

//Records
const holidayTranslations: Record<string, string> = {
  "New Year's Day": "Nouvel an",
  "Easter Monday": "Lundi de Pâques",
  "Labour Day": "Fête du Travail",
  "Ascension Day": "Ascension",
  "Whit Monday": "Lundi de Pentecôte",
  "Assumption Day": "Assomption",
  "All Saints' Day": "Toussaint",
  "Armistice Day": "Armistice",
  "Christmas Day": "Noël",
};

export const useGetBelgiumHolidays = (
  year: string,
  queryParams?: Omit<UseQueryOptions, "queryKey" | "queryFn">
) => {
  const query = useQuery({
    queryKey: ["belgiumHoliday"],
    queryFn: async () => {
        const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/BE`, {
            method: "GET",
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            },
          });
          const holidays = await response.json();
    
          if(holidays.error){
            query.isError = true
          }
    
          return holidays.map((holiday: any) => {
            return {
                dateId: toDateId(new Date(holiday.date)),
                name: holidayTranslations[holiday.name] ?? holiday.name
            }
          });
    },
    ...queryParams,
  });
  return query;
};