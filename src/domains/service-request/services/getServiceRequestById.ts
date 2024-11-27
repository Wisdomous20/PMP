import { prisma } from "@/lib/prisma";

export default async function getServiceRequestById(serviceRequestId: string) {
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

  const { user, title, details, status } = serviceRequest;
  const requesterName = user.name;
  const createdOn = status.length > 0 ? status[0].timestamp : null;

  return {
    requesterName,
    title,
    details,
    createdOn,
  };
}
