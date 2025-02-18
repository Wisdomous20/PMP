import {prisma} from "@/lib/prisma";

export default async function updateRating(id: string, ratings: number, description: string) {
        const updatedRating = await prisma.serviceRequestRating.update({
            where: { id },
            data: { ratings, description },
        });

        return updatedRating;
}