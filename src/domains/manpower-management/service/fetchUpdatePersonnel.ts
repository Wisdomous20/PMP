export default async function fetchUpdatePersonnel(
    id: string, name: string, department: string, position: string
) {
    const endpoint = `/api/manpower-management/update-personnel`;
    const body = JSON.stringify({ id, name, department, position });
  
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