export async function fetchDeleteEquipmentById(equipmentId: string) {
  const response = await fetch(`/api/equipment-management/${equipmentId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete equipment');
  }

  return await response.json();
}