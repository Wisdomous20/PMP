export default async function fetchDeleteUser(id: string) {
    try {
        const response = await fetch(`/api/user/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        });
    
        if (!response.ok) {
        throw new Error("Failed to delete user");
        }
    
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error deleting user:", error);
        throw new Error("Failed to delete user");
    }
}