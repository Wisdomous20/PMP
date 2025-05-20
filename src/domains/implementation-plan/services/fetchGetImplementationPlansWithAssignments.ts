export default async function fetchGetImplementationPlanWithAssignments(serviceRequestId: string) {
  const response = await fetch(`/api/implementation-plan/${serviceRequestId}/assignments?include=assignments`);
  
  if (!response.ok) {
    throw new Error(`Error ${response.status}: Could not fetch implementation plan`);
  }
  
  return response.json();
}