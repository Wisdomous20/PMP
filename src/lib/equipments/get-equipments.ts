"use server"

import client from "@/lib/database/client";
import {ErrorCodes} from "@/lib/ErrorCodes";
import type {GenericFailureType} from "@/lib/types/GenericFailureType";
import {Prisma} from "@prisma/client";
import validator from "@/lib/validators";

interface GetAllEquipmentsParams {
  page: number;
  pageSize: number;
  department?: string;
}

const queryArgs = Prisma.validator<Prisma.EquipmentFindManyArgs>()({
  orderBy: {datePurchased: "desc"},
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

async function $countAllEquipments(constraintOptions?: Prisma.EquipmentWhereInput) {
  return await client.equipment.count({
    where: constraintOptions
  });
}

export type GetAllEquipmentsResultRaw = Prisma.EquipmentGetPayload<typeof queryArgs>;

interface GetAllEquipmentsResult extends GenericFailureType {
  data?: {
    result: Array<GetAllEquipmentsResultRaw>,
    total: number,
    totalPages: number,
    page: number,
    pageSize: number,
  }
}

export async function getAllEquipments(params: GetAllEquipmentsParams): Promise<GetAllEquipmentsResult> {
  // Validate Stuff
  const validationResult = await validator.validate(params, {
    properties: {
      page: { type: "number", min: 1 },
      pageSize: { type: "number", min: 1 },
      department: { type: "string", formatter: "non-empty-string"},
    },
    requiredProperties: [],
    allowUnvalidatedProperties: true,
  });
  if (!validationResult.ok) {
    return {
      code: ErrorCodes.REQUEST_REQUIREMENT_NOT_MET,
      message: validator.toPlainErrors(validationResult.errors),
    }
  }

  // If page or pageSize is not specified, just return all equipments
  if (!params.page || !params.pageSize) {
    const all = await client.equipment.findMany(queryArgs);
    return {
      code: ErrorCodes.OK,
      data: {
        result: all,
        total: all.length,
        totalPages: 1,
        page: 1,
        pageSize: all.length,
      }
    }
  }

  // Filter constraints
  const constraints: Prisma.EquipmentWhereInput = {};

  // If the department is specified, include it in filters
  if (params.department) {
    constraints.department = params.department;
  }

  // Calculate the pagination stuff
  const total = await $countAllEquipments(constraints);
  const totalPages = Math.ceil(total / params.pageSize);
  const skip = (params.page - 1) * params.pageSize;

  const equipments = await client.equipment.findMany({
    ...queryArgs,
    skip,
    take: params.pageSize,
    where: constraints,
  });

  return {
    code: ErrorCodes.OK,
    data: {
      result: equipments,
      total,
      totalPages,
      page: params.page,
      pageSize: params.pageSize,
    }
  }
}
