export default async function fetchDeletePersonnel(personnelId: string) {
    const endpoint = `/api/manpower-management/personnel/${personnelId}`;
  
    try {
      const response = await fetch(endpoint, {
        method: "DELETE",
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
      console.error("Failed to delete personnel:", error);
      throw error;
    }
}