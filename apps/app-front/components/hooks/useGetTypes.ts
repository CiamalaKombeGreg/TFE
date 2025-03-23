import {useQuery, UseQueryOptions} from "@tanstack/react-query";

export const useGetTypes = (
  queryParams?: Omit<UseQueryOptions, "queryKey" | "queryFn">
) => {
  const query = useQuery({
    queryKey: ["types"],
    queryFn: async () => {
      const response = await fetch(process.env.EXPO_PUBLIC_API_HOLIDAY_TYPE || "http://localhost:3000/types", {
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