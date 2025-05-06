export default async function fetchCreatePersonnel(name: string, department: string) {
    try{
        const response = await fetch('/api/manpower-management', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
            name,
            department
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error ${response.status}: ${errorData.error}`);
        }
        const responseData = await response.json();
        return responseData;
    }catch(error){
        console.error('Failed to create personnel:', error);
        throw error;
    }

}