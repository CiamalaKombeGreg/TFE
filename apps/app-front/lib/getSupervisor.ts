export const getOwner = async (id: string) => {

    const api_key = process.env.EXPO_PUBLIC_SERVER_URL
      const response = await fetch(api_key ? `${api_key}/absences/owner/${id}` : `http://localhost:3000/absences/owner/${id}`, {
        method: "GET",
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        },
      });

      const fetchedData = await response.json();

      if(fetchedData.error){
        return "ERROR"
      }

      return fetchedData;
}