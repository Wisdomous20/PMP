export default async function fetchDeleteSelectedServiceRequestArchive(serviceRequestIds: string[]) {
    const response = await fetch(`/api/service-request/archive`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ serviceRequestIds })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error ${response.status}: ${errorData.error}`);
    }

    return await response.json();
}