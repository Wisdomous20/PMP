"use server";

import { addApprovedStatus } from "@/lib/service-request/request-status-helpers/addApprovedStatus";
import { assignSupervisor } from "@/lib/service-request/request-status-helpers/assign-supervisor"
import client from "@/lib/database/client";
import { createNotification } from "@/lib/notification/create-notification";
import { sendServiceRequestStatusEmail } from "@/lib/mailer/sendServiceRequestStatusEmail"; 

export async function approveServiceRequest(serviceRequestId: string, supervisorId: string, note: string) {

  const request = await client.serviceRequest.findUnique({
    where: { id: serviceRequestId },
    include: { user: true },
  });

  if (!request) {
    return new Error("No request found");
  }

  const [response] = await Promise.all([
    assignSupervisor(serviceRequestId, supervisorId), 
    addApprovedStatus(serviceRequestId, note)
  ])

  if (!response.data) {
    return new Error("No supervisor found")
  }

  await createNotification(
    "service_request",
    `Service request ${request.concern} approved and assigned to supervisor ${response.data.supervisorAssignment.supervisorName}.`,
    `/service-requests/${serviceRequestId}`
  );

  await sendServiceRequestStatusEmail({
    to: request.user.email,
    userName: `${request.user.firstName} ${request.user.lastName}`,
    statusText: "Approved",
    concern: request.concern,
    details: request.details,
    note,              
    color: "#27ae60",
  });
}