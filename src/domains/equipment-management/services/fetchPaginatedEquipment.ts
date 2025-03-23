interface FetchPaginatedEquipmentParams {
    page: number;
    pageSize: number;
    department?: string;
  }
  

  export default async function fetchPaginatedEquipment({
    page,
    pageSize,
    department,
  }: FetchPaginatedEquipmentParams): Promise<PaginatedResponse<Equipment>> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });
  
    if (department && department !== "all") {
      params.append("department", department);
    }

    const endpoint = `/api/equipment-management?${params.toString()}`;
  
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  
    if (!response.ok) {
      throw new Error(`Failed to fetch equipment: ${response.statusText}`);
    }
  
    return await response.json();
  }