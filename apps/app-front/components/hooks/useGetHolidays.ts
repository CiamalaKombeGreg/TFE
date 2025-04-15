import {useQuery, UseQueryOptions} from "@tanstack/react-query";
import { getDatesPeriode } from "@/lib/getHolidayPeriod";

// Themes
import { unknownTheme } from "@/lib/MarkedTheme";

export const useGetHolidays = (
  queryParams?: Omit<UseQueryOptions, "queryKey" | "queryFn">
) => {
  const query = useQuery({
    queryKey: ["holidays"],
    queryFn: async () => {
      const api_key = process.env.EXPO_PUBLIC_SERVER_URL
      const response = await fetch(api_key ? `${api_key}/absences` : "http://localhost:3000/absences", {
        method: "GET",
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        },
      });
      const fetchedData = await response.json();
      const newFetchedData: any = {};
      if(fetchedData.error){
        query.isError = true
      }else{
        for(let item of fetchedData){
          const startTimestamp = new Date(item.startDate);
          const endTimestamp = new Date(item.endDate);
          const dates = getDatesPeriode(startTimestamp, endTimestamp);

          for (let i of dates) {
                const dateString = new Date(i).toISOString().split('T')[0];
                newFetchedData[dateString] = {
                  selected: true,
                  selectedColor: 'gray',
                  marked: true,
                  dotColor: 'red',
                  selectedTextColor: 'red'

              };
          }
        }
      }

      return newFetchedData;
    },
    ...queryParams,
  });
  return query;
};