import { prisma } from "@/lib/prisma";

export async function getPendingServiceRequests(userId: string) {
 const user = await prisma.user.findUnique({
   where: { id: userId },
   select: {
     user_type: true,
     department: true,
   },
 });
 
 if (!user) {
   throw new Error("User not found");
 }
 
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
 const whereConditions: any = {
   status: {
     every: {
       status: "pending",
     },
     none: {
       status: { not: "pending" },
     },
   },
 };
 
 if (user.user_type === 'SUPERVISOR') {
   whereConditions.user = {
     department: user.department,
   };
 }
 
 const requests = await prisma.serviceRequest.findMany({
   where: whereConditions,
   include: {
     user: true,
     status: {
       orderBy: {
         timestamp: "desc",
       },
     },
   },
 });

 const formattedRequests = requests.map((request) => {
   const { id, user, concern, details, status } = request;
   const requesterName = `${user.firstName} ${user.lastName}`;
   const createdOn = status.length > 0 ? status[0].timestamp : null;
   return {
     id,
     user,
     requesterName,
     concern,
     details,
     status,
     createdOn,
   };
 });

 return formattedRequests;
}