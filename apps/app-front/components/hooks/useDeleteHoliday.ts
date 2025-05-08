import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteHoliday = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (holidayId: string) => {
      const api_key = process.env.EXPO_PUBLIC_SERVER_URL
      const response = await fetch(api_key ? `${api_key}/absences/${holidayId}` : `http://localhost:3000/absences/${holidayId}`, {
        method: "DELETE",
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete holiday");
      }

      return response.json();
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["holidays", id] });
        queryClient.invalidateQueries({ queryKey: ["holidays"] });
    },
  });
};