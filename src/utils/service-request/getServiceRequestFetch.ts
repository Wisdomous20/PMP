export default async function getServiceRequestFetch(
  inputs: GetServiceRequestInputs
) {
  const { userType, userId, department } = inputs;

  const queryParams = new URLSearchParams({ userType });
  if (userId) {
    queryParams.append("userId", userId);
  }
  if (department) {
    queryParams.append("department", department);
  }

  const endpoint = `/api/service-requests?${queryParams.toString()}`;

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
    console.error("Failed to fetch service requests:", error);
    throw error;
  }
}
