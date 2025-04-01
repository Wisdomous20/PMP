import { prisma } from "@/lib/prisma";
 
 export async function deleteArchiveServiceRquests(){
     try{
         const now = new Date();
         await prisma.serviceRequest.deleteMany({
             where:{
                 deleteAt:{
                     lte: now
                 }
             }
         });
         console.log("Deleted archived service requests");
     }catch(error){
         console.error("Error deleting archived service requests:", error);
     }
 }

 export async function deleteSelectedServiceRequestArchive(serviceRequestIds: string[]) {
    try {
        const result = await prisma.serviceRequest.deleteMany({
            where: {
                id: {
                    in: serviceRequestIds
                }
            }
        });
        return result;
    } catch (error) {
        console.error("Error manually deleting archived service requests:", error);
        throw error;
    }
}