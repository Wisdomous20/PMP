"use server";

import client from "@/lib/database/client";
import * as dashboard from "@/lib/dashboard/dashboard";
import {ErrorCodes} from "@/lib/ErrorCodes";
import * as equipment from "@/lib/dashboard/equipments";
import type {GenericFailureType} from "@/lib/types/GenericFailureType";
import * as implementationPlans from "@/lib/dashboard/implementation-plans";
import * as notifications from "@/lib/dashboard/notifications";
import * as serviceRequests from "@/lib/dashboard/service-requests";
import type {User} from "@prisma/client";
import validator from "@/lib/validators";

async function $getDashboardData(user: User) {
  try {
    const promises = await Promise.all([
      implementationPlans.getImplementationPlans(user),
      notifications.getNotifications(user),
      equipment.getPaginatedEquipment(user, 1, 15),
      serviceRequests.getPendingServiceRequests(user),
      dashboard.getDashboardStats(user)
    ]);

    return {
      implementationPlans: promises[0],
      notifications: promises[1],
      equipment: promises[2],
      newServiceRequests: promises[3],
      dashboardStats: promises[4],
    };
  } catch {
    return null;
  }
}

export interface DashboardDataResult extends GenericFailureType {
  data?: Awaited<ReturnType<typeof $getDashboardData>>
}

export async function getDashboardData(userId: string): Promise<DashboardDataResult> {
  // Validation for Sanity Check
  const validationResult = await validator.validate({ userId }, {
    properties: {
      userId: { type: "string", formatter: "non-empty-string" },
    },
    requiredProperties: ["userId"],
  });

  if (!validationResult.ok) {
    return {
      code: ErrorCodes.DASHBOARD_ID_ERROR,
      message: validator.toPlainErrors(validationResult.errors),
    }
  }

  const user = await client.user.findUnique({
    where: { id: userId }
  });
  if (!user) {
    return {
      code: ErrorCodes.ACCOUNT_NOT_FOUND,
      message: "Account not found",
    };
  }

  const data = await $getDashboardData(user);
  if (data === null) {
    return {
      code: ErrorCodes.DASHBOARD_FAILURE,
      message: "Unable to fetch dashboard data",
    }
  }

  return {
    code: ErrorCodes.OK,
    data,
  };
}
