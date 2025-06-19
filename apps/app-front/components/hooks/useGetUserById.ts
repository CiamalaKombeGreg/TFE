import {useQuery, UseQueryOptions} from "@tanstack/react-query";

export const useGetUserById = (
  id?: string,
  queryParams?: Omit<UseQueryOptions, "queryKey" | "queryFn">
) => {
  const query = useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const api_key = process.env.EXPO_PUBLIC_SERVER_URL
      const response = await fetch(api_key ? `${api_key}/personnelID/${id}` : `http://localhost:3000/personnelID/${id}`, {
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