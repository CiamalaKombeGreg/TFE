import { UserRelatedAbsenceProps } from "@/lib/types";
import {useQuery, UseQueryOptions} from "@tanstack/react-query";

export const useGetRelatedHolidays = (
  email : string,
  queryParams?: Omit<UseQueryOptions, "queryKey" | "queryFn">
) => {
  const query = useQuery({
    queryKey: ["holidays", email],
    queryFn: async () => {
      const api_key = process.env.EXPO_PUBLIC_SERVER_URL
      const response = await fetch(api_key ? `${api_key}/absences/related/${email}` : `http://localhost:3000/absences/related/${email}`, {
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
  const initModal = (users: unknown) => {
      const initAllModal : UserRelatedAbsenceProps[] = []
      if(Array.isArray(users)){
          for(let element of users){
              initAllModal.push({prsId : element.prsId, pseudo : element.pseudo, email : element.email, conges : element.conges, roles: element.roles})
          }
      }
      return initAllModal
  }

  return {data : initModal(query.data), isLoading : query.isLoading}
};