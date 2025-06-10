import {useQuery, UseQueryOptions} from "@tanstack/react-query";

export const useGetStatus = (
  email : string,
  queryParams?: Omit<UseQueryOptions, "queryKey" | "queryFn">
) => {
  const query = useQuery({
    queryKey: ["currentHoliday", email],
    queryFn: async () => {
      const api_key = process.env.EXPO_PUBLIC_SERVER_URL
      const response = await fetch(api_key ? `${api_key}/absences/today/${email}` : `http://localhost:3000/absences/today/${email}`, {
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