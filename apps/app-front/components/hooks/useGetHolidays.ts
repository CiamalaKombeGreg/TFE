import {useQuery, UseQueryOptions} from "@tanstack/react-query";

export const useGetHolidays = (
  queryParams?: Omit<UseQueryOptions, "queryKey" | "queryFn">
) => {
  const query = useQuery({
    queryKey: ["holidays"],
    queryFn: async () => {
      const api_key = process.env.EXPO_PUBLIC_SERVER_URL
      const response = await fetch(api_key ? `${api_key}/absences` : `http://localhost:3000/absences`, {
        method: "GET",
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        },
      });
      const fetchedData = await response.json();

      if(fetchedData.error){
        query.isError = true
      }

      return fetchedData;
    },
    ...queryParams,
  });
  return query;
};