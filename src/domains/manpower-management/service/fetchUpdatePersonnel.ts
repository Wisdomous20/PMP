export default async function fetchUpdatePersonnel(
    personnelId: string, name: string, department: string, position: string
) {
  const endpoint = `/api/manpower-management/personnel/${personnelId}`;
  const body = JSON.stringify({ personnelId, name, department, position });
  
    try {
      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error ${response.status}: ${errorData.error}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error("Failed to update personnel:", error);
      throw error;
    }

}