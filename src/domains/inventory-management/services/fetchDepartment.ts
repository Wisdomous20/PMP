export default async function fetchDepartment(): Promise<string[]> {
    try {
      const response = await fetch("/api/equipment-management?departments=true", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch departments: ${response.statusText}`);
      }
  
      const data = await response.json();
      
      if (data && data.departments && Array.isArray(data.departments)) {
        return data.departments;
      }
      
      throw new Error("Invalid departments data structure");
    } catch (error) {
      console.error("Error fetching departments:", error);
      return []; 
    }
  }