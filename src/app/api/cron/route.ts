import {NextRequest, NextResponse} from "next/server";
import deleteArchive from "@/domains/service-request/services/deleteArchive";

 export async function DELETE(req: NextRequest) {
    // const authHeader = request.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    //   return new Response('Unauthorized', {
    //     status: 401,
    //   });
    // }

     const {serviceRequestId} = await req.json();
 
     if (!serviceRequestId) {
         return NextResponse.json(
             {error: "Service request ID is required"},
             {status: 400}
         );
     }
 
     try {
         const status = await deleteArchive();
 
         return NextResponse.json(
             {message: `Archived status added successfully`, status},
             {status: 200}
         );
     } catch (error) {
         console.error(`Error adding archived status:`, error);
         return NextResponse.json(
             {error: `Failed to add archived status`},
             {status: 500}
         );
     }
 }