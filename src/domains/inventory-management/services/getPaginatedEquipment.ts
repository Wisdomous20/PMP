import { prisma } from "@/lib/prisma"; 

interface FetchPaginatedEquipmentParams {
  page: number;
  pageSize: number;
  userId?: string;
}

export async function getPaginatedEquipment({
  page,
  pageSize,
  userId,
}: FetchPaginatedEquipmentParams): Promise<Equipment[]> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        user_type: true,
        department: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const currentPage = parseInt(page.toString());
    const itemsPerPage = parseInt(pageSize.toString());

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereConditions: any = {};

    if (user.user_type === "SUPERVISOR") {
      whereConditions.department = user.department;
    }

    const skip = (currentPage - 1) * itemsPerPage;
    const take = itemsPerPage;

    const equipment = await prisma.equipment.findMany({
      where: whereConditions,
      skip,
      take,
      orderBy: {
        dateReceived: "desc",
      },
      include: {
        serviceRequest: {
          select: {
            id: true,
            details: true,
            concern: true,
          },
        },
      },
    });

    const mappedEquipment = equipment.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      description: item.description,
      brand: item.brand,
      serialNumber: item.serialNumber,
      unitCost: item.unitCost,
      totalCost: item.totalCost,
      datePurchased: item.datePurchased,
      supplier: item.supplier,
      dateReceived: item.dateReceived,
      status: item.status,
      location: item.location,
      department: item.department,
      serviceRequest: item.serviceRequest
        ? {
            serviceRequestId: item.serviceRequest.id,
            serviceRequestName:
              item.serviceRequest.concern || item.serviceRequest.id,
          }
        : undefined,
    }));

    return mappedEquipment;
  } catch (error) {
    console.error("Error fetching equipment:", error);
    throw error;
  }
}
