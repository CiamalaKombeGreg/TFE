import {useQuery, UseQueryOptions} from "@tanstack/react-query";

export const useAddRequest = (
  data: {
    title: string;
    typeId: string;
    startDate: Date;
    endDate: Date;
    commentaire: string; 
  },
  queryParams?: Omit<UseQueryOptions, "queryKey" | "queryFn">
) => {
  const query = useQuery({
    queryKey: ["holidays", data],
    queryFn: async () => {
      const settings = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      };
      const api_key = process.env.EXPO_PUBLIC_SERVER_URL
      const response = await fetch(api_key ? `${api_key}/absences` : "http://localhost:3000/absences", settings);
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