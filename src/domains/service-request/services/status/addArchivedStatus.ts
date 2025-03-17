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

         const deleteDate = new Date();
         deleteDate.setFullYear(deleteDate.getFullYear() + 5);
 
         await prisma.serviceRequest.update({
         where: { id: serviceRequestId },
         data: {
             deleteAt: deleteDate,
         },
         });
         return status;
     } catch (error) {
         console.error("Error adding archived status:", error);
         throw error;
     }
     }