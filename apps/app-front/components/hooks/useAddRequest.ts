import {useQuery, UseQueryOptions} from "@tanstack/react-query";
import { FormRequestProps } from "../../../../packages/types/formRequest"

export const useAddRequest = (
  data: FormRequestProps,
  queryParams?: Omit<UseQueryOptions, "queryKey" | "queryFn">
) => {
  const query = useQuery({
    queryKey: ["holiday", data],
    queryFn: async () => {
      const settings = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      };
      const response = await fetch(`http://192.168.129.8:3000/absences`, settings);
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