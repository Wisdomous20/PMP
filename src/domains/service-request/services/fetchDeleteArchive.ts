export default async function fetchDeleteArchive(){
    const response = await fetch(`/api/service-request/delete-archive`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error('Failed to delete archive');
    }

    return await response.json();
}