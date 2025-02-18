import { prisma } from "@/lib/prisma";

export default async function getRating(id: string) {
    try{
        const rating = await prisma.serviceRequestRating.findUnique({
            where: { id },
            include: {
                serviceRequest: true,
                },
          });
        
          if (!rating) {
            throw new Error("Rating not found");
          }
          return rating;
    }catch(error){
        console.error("Error fetching rating:", error);
        throw new Error("Failed to retrieve rating");
    }

}