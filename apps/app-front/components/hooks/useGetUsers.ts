import { UsersListModal } from "@/lib/types";
import {useQuery, UseQueryOptions} from "@tanstack/react-query";

export const useGetUsers = (
    queryParams?: Omit<UseQueryOptions, "queryKey" | "queryFn">
) => {
    const query = useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const api_key = process.env.EXPO_PUBLIC_SERVER_URL
            const response = await fetch(api_key ? `${api_key}/personnel` : `http://localhost:3000/personnel`, {
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
        const initAllModal : UsersListModal[] = []
        if(Array.isArray(users)){
            for(let element of users){
                initAllModal.push({email : element?.email, pseudo: element?.pseudo, roles: element?.role, isOpen: false})
            }
        }
        return initAllModal
    }

    return {data : initModal(query.data), isLoading : query.isLoading}
};