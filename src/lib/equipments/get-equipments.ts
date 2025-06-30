"use server"

// import { ajv, validate } from "@/lib/validators/ajv";
import validator from "@/lib/validators"
import client from "@/lib/database/client";
import { ErrorCodes } from "../ErrorCodes";
import { GenericFailureType } from "@/lib/types/GenericFailureType";
import { $Enums } from "@prisma/client";

interface EquipmentParams {
  departments?: string,
  page?: number,
  pageSize?: number,
  department?: string
}

interface EquipmentResult extends GenericFailureType {
  data?: Array<{
    id: string,
    quantity: number,
    description: string,
    brand: string,
    serialNumber: string,
    supplier: string,
    unitCost: number,
    totalCost: number,
    datePurchased: Date,
    dateReceived: Date,
    status: $Enums.equipment_status,
    location: string,
    department: string,
    serviceRequestId?: string | null,
  }>,
  department?: string[],
  meta?: {
    total: number,
      page: number,
      pageSize: number,
      pageCount: number,
  },
  status?: number
}

export async function getEquipmentById(serviceRequestId: string): Promise<EquipmentResult> {

  const validationResult = await validator.validate({ serviceRequestId }, {
    properties: {
      serviceRequestId: { type: "string", formatter: "non-empty-string" }
    },
    requiredProperties: ["serviceRequestId"]
  })

  if (!validationResult.ok) {
    return {
      code: ErrorCodes.EQUIPMENT_ID_ERROR,
      message: validator.toPlainErrors(validationResult.errors)
    }
  }

  try {
    const equipment = await client.equipment.findMany({
      where: {
        serviceRequestId: serviceRequestId
      }
    });

    if (!equipment) {
      return {
        code: ErrorCodes.EQUIPMENT_NOT_FOUND,
        message: "Equipment does not exist."
      }
    }

    return {
      code: ErrorCodes.OK,
      data: equipment
    }

  } catch (error) {
    console.error("Error fetching equipment:", error);
    return {
      code: ErrorCodes.GENERIC_ERROR,
      message: "Something went wrong while fetching equipment. Please try again later."
    }
  }
}

export async function getAllEquipment(params: EquipmentParams): Promise<EquipmentResult> {

  if (params.departments) {
    const departmentsData = await client.equipment.findMany({
      distinct: ["department"],
      select: {
        department: true
      }
    })

    const departments = departmentsData
      .map((item) => item.department)
      .filter(Boolean)
      .sort();

    return {
      code: ErrorCodes.OK,
      department: departments
    }
  }

  if (!params.page && !params.pageSize) {
    const equipment = await client.equipment.findMany({
      orderBy: {
        datePurchased: "desc"
      }
    })

    return {
      code: ErrorCodes.OK,
      data: equipment
    }
  }

  let whereConditions = {
    department: ""
  }

  if (params.department) {
    whereConditions.department = params.department
  }

  const totalCount = await client.equipment.count({
    where: whereConditions
  })

  const currentPage = params.page ?? 1;
  const itemsPerPage = params.pageSize ?? 10;
  const skip = (currentPage - 1) * itemsPerPage;
  const pageCount = Math.ceil(totalCount / itemsPerPage)

  const equipment = await client.equipment.findMany({
    where: whereConditions,
    skip,
    take: itemsPerPage,
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
    }
  })

  const mappedEquipment = equipment.map(item => ({
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
    serviceRequest: item.serviceRequest ? {
      serviceRequestId: item.serviceRequest.id,
      serviceRequestName: item.serviceRequest.concern || item.serviceRequest.id,
    } : undefined,
  }));

  return {
    code: ErrorCodes.OK,
    data: mappedEquipment,
    meta: {
      total: totalCount,
      page: currentPage,
      pageSize: itemsPerPage,
      pageCount,
    },
    status: 200
  }
}