export default async function fetchGetPersonnelById(personnelId: string) {
    const endpoint = `/api/manpower-management/personnel/${personnelId}`;
  
    try {
      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error ${response.status}: ${errorData.error}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch personnel:", error);
      throw error;
    }
}