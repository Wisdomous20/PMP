import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import addRejectedStatus from "@/domains/service-request/services/status/addRejectedStatus";
import { createNotification } from "@/domains/notification/services/createNotification";
import { sendServiceRequestStatusEmail } from "@/domains/notification/services/sendServiceRequestStatusEmail";

export async function POST(req: NextRequest) {
  const { serviceRequestId, note } = await req.json();
  if (!serviceRequestId) {
    return NextResponse.json({ error: "serviceRequestId is required" }, { status: 400 });
  }

  const request = await prisma.serviceRequest.findUnique({
    where: { id: serviceRequestId },
    include: { user: true },
  });
  if (!request) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const status = await addRejectedStatus(serviceRequestId, note);

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

  return NextResponse.json({ message: "Rejected", status }, { status: 200 });
}