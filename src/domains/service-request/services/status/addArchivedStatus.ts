import {prisma} from "@/lib/prisma";

export default async function addArchivedStatus(serviceRequestId: string) {
    try {
        const status = await prisma.serviceRequestStatus.create({
        data: {
            serviceRequestId: serviceRequestId,
            status: "archived",
            timestamp: new Date(),
        },
        });

        await prisma.serviceRequest.update({
        where: { id: serviceRequestId },
        data: {
            deletedAt: new Date(new Date(),setFullYear(new Date().getFullYear() + 5)),
        },
        });
        return status;
    } catch (error) {
        console.error("Error adding archived status:", error);
        throw error;
    }
    }