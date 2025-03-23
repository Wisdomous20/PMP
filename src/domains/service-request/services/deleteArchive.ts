import { prisma } from "@/lib/prisma";
 
 export default async function deleteArchiveServiceRquests(){
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