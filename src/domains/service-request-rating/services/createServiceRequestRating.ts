import {prisma} from "@/lib/prisma";

export default async function createServiceRequestRating(serviceRequestId: string, ratings: number, description: string): Promise<{
    id: string;
    serviceRequestId: string;
    ratings: number;
    description: string;
}> {
    try {
        const serviceRequestRating = await prisma.serviceRequestRating.create({
            data: {
                serviceRequestId: serviceRequestId,
                ratings,
                description,
            },
        });
        return serviceRequestRating;
    } catch (error) {
        console.error("Error creating service request rating:", error);
        throw new Error("Failed to create service request rating");
    }
}