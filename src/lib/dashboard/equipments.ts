"use server";

import client from "@/lib/database/client";
import type {Prisma, User} from "@prisma/client";

export async function getPaginatedEquipment(user: User, page: number, pageSize: number) {
  const currentPage = parseInt(page.toString());
  const itemsPerPage = parseInt(pageSize.toString());

  const whereConditions: Prisma.EquipmentWhereInput = {};

  if (user.user_type === "SUPERVISOR") {
    whereConditions.department = user.department;
  }

  const skip = (currentPage - 1) * itemsPerPage;
  const take = itemsPerPage;

  const equipment = await client.equipment.findMany({
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

  return equipment.map((item) => ({
    id: item.id,
    quantity: item.quantity,
    description: item.description,
    brand: item.brand,
    serialNumber: item.serialNumber,
    unitCost: item.unitCost,
    totalCost: item.totalCost,
    datePurchased: new Date(item.datePurchased).toISOString(),
    supplier: item.supplier,
    dateReceived: new Date(item.dateReceived).toISOString(),
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
}
