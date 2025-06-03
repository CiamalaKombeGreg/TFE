import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useEditRequest = (id : string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({holidayId, comment, startDate, endDate} : {holidayId : string, comment : string, startDate : Date, endDate : Date}) => {
      const api_key = process.env.EXPO_PUBLIC_SERVER_URL

      // Data
      const requestData = {
        id : holidayId,
        comment,
        startDate,
        endDate
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

      const response = await fetch(api_key ? `${api_key}/absences/edit` : `http://localhost:3000/absences/edit`, settings);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update holiday");
      }

      return await response.json();

    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["holidays", id] });
        queryClient.invalidateQueries({ queryKey: ["holidays"] });
    },
  });
}