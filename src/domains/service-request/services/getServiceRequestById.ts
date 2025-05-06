import { prisma } from "@/lib/prisma";

export default async function getServiceRequestById(serviceRequestId: string) : Promise<ServiceRequest> {
  const serviceRequest = await prisma.serviceRequest.findUnique({
    where: { id: serviceRequestId },
    include: {
      user: true,
      status: {
        orderBy: {
          timestamp: 'asc',
        },
      },
    },
  });

  if (!serviceRequest) {
    throw new Error("Service request not found");
  }

  const { id, user, concern, details, status } = serviceRequest;
  const requesterName = `${user.firstName} ${user.lastName}`;
  const createdOn = status.length > 0 ? status[0].timestamp : null;

  const serviceRequestStatus : Status[] = status.map((status) => {
    return {
      id: status.id,
      status: status.status,
      timestamp: status.timestamp,
      note: status.note,
    };
  })

  return {
    id,
    requesterName,
    concern,
    user,
    details,
    createdOn,
    status: serviceRequestStatus
  };
}
