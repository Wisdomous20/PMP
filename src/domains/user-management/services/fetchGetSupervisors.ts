export default async function fetchGetSupervisors(): Promise<Supervisor[] | null> {
  const endpoint = `/api/supervisor`;

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

    const data = await response.json();
    return data as Supervisor[];
  } catch (error) {
    console.error("Failed to fetch supervisor details:", error);
    return null;
  }
}
