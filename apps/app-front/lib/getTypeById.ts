export const getTypeById = async (typeId: string) => {

    const api_key = process.env.EXPO_PUBLIC_SERVER_URL
      const response = await fetch(api_key ? `${api_key}/types/${typeId}` : `http://localhost:3000/types/${typeId}`, {
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

      return fetchedData.label;
}