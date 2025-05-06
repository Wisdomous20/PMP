import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import addApprovedStatus from "@/domains/service-request/services/status/addApprovedStatus";
import assignSupervisor from "@/domains/service-request/services/assignSupervisor";
import { createNotification } from "@/domains/notification/services/createNotification";
import { sendServiceRequestStatusEmail } from "@/domains/notification/services/sendServiceRequestStatusEmail"; 

export async function POST(req: NextRequest) {
  const { serviceRequestId, supervisorId, note } = await req.json();
  if (!serviceRequestId || !supervisorId) {
    return NextResponse.json({ error: "Missing IDs" }, { status: 400 });
  }

  const request = await prisma.serviceRequest.findUnique({
    where: { id: serviceRequestId },
    include: { user: true },
  });
  if (!request) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await assignSupervisor(serviceRequestId, supervisorId);
  const status = await addApprovedStatus(serviceRequestId, note);

  await createNotification(
    "service_request",
    `Service request ${serviceRequestId} approved and assigned to supervisor ${supervisorId}.`,
    `/admin/service-requests/${serviceRequestId}`
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

  return NextResponse.json({ message: "Approved", status }, { status: 200 });
}