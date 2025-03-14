import { NextRequest, NextResponse } from "next/server";
import getServiceRequestById from "@/domains/service-request/services/getServiceRequestById";
import setServiceRequestArchive from "@/domains/service-request/services/setServiceRequestArchive";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { error: "Service request ID is required" },
      { status: 400 }
    );
  }

  try {
    const serviceRequest = await getServiceRequestById(id);
    return NextResponse.json(serviceRequest, { status: 200 });
  } catch (error) {
    console.error("Error fetching service request:", error);
    return NextResponse.json(
      { error: "Failed to retrieve service request" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
    
    try{
        const {serviceRequestId} = await req.json();

        if(!serviceRequestId){
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const updatedServiceRequest = await setServiceRequestArchive(serviceRequestId);
        return NextResponse.json(updatedServiceRequest, { status: 200 });
    }catch(error){
        console.error("Error fetching archive:", error);
        return NextResponse.json(
            { error: "Failed to retrieve archive" },
            { status: 500 }
        );
    }
}
