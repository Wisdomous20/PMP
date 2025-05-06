import { NextRequest, NextResponse } from "next/server";
import  getArchivedServiceRequests  from "@/domains/service-request/services/getArchivedServiceRequest";
import addArchivedStatus from "@/domains/service-request/services/status/addArchivedStatus";
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const userId = searchParams.get("userId");
  
  if (!userId) {
    return NextResponse.json(
      { error: "User ID is required" },
      { status: 400 }
    );
  }
  
  try {
    const archivedRequests = await getArchivedServiceRequests();
    return NextResponse.json(archivedRequests);
  } catch (error) {
    console.error("Error fetching archived service requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch archived service requests" },
      { status: 500 }
    );
  }
}


export async function POST(req: NextRequest) {
  try {
    const { serviceRequestId } = await req.json();
    
    if (!serviceRequestId) {
      return NextResponse.json(
        { error: "Service request ID is required" },
        { status: 400 }
      );
    }
    
    const status = await addArchivedStatus(serviceRequestId);
    
    return NextResponse.json(
      { message: "Service request archived successfully", status },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error archiving service request:", error);
    return NextResponse.json(
      { error: "Failed to archive service request" },
      { status: 500 }
    );
  }
}