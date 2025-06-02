export const getFileByKey = async (key: string) => {

    const api_key = process.env.EXPO_PUBLIC_SERVER_URL
      const response = await fetch(api_key ? `${api_key}/upload/${key}` : `http://localhost:3000/upload/${key}`, {
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

      return fetchedData.redirectUrl;
}