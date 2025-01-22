export default async function fetchGerPersonnelByDepartment(department: string) {
    const endpoint = `/api/manpower-management/${department}`;
  
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