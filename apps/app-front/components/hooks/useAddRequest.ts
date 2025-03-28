import {useQuery, UseQueryOptions} from "@tanstack/react-query";
import { FormRequestProps } from "../../../../packages/types/formRequest"

export const useAddRequest = (
  data: FormRequestProps,
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
      const response = await fetch(process.env.EXPO_PUBLIC_API_HOLIDAY_TYPE ?? "http://localhost:3000/absences", settings);
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