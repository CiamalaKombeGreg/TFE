import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useRespondRequest = (id : string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({holidayId, comment, status} : {holidayId : string, comment : string, status : string}) => {
      const api_key = process.env.EXPO_PUBLIC_SERVER_URL

      // Data
      const requestData = {
        id : holidayId,
        comment,
        status
      }

      // POST settings
      const settings = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      };

      const response = await fetch(api_key ? `${api_key}/absences/status` : `http://localhost:3000/absences/status`, settings);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update holiday");
      }

      return response.json();
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["holidays", id] });
        queryClient.invalidateQueries({ queryKey: ["holidays"] });
    },
  });
};