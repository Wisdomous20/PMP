"use server";

import client from "@/lib/database/client";
import { addRejectedStatus } from "@/lib/service-request/request-status-helpers/addRejectedStatus"
import { createNotification } from "@/lib/notification/create-notification";
import { sendServiceRequestStatusEmail } from "@/lib/mailer/sendServiceRequestStatusEmail";

export async function rejectServiceRequest(serviceRequestId: string, note: string) {

  const request = await client.serviceRequest.findUnique({
    where: { id: serviceRequestId },
    include: { user: true },
  });
  if (!request) {
    return new Error("No service request found")
  }

  await addRejectedStatus(serviceRequestId, note);

  await createNotification(
    "service_request",
    `Service request ${serviceRequestId} has been rejected.`,
    `/admin/service-requests/${serviceRequestId}`
  );

  await sendServiceRequestStatusEmail({
    to: request.user.email,
    userName: `${request.user.firstName} ${request.user.lastName}`,
    statusText: "Rejected",
    concern: request.concern,
    details: request.details,
    note,           
    color: "#e74c3c",
  });
}