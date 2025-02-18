import { NextRequest, NextResponse } from "next/server";
import getRating from "@/domains/service-request-rating/services/getRating";
import updateRating from "@/domains/service-request-rating/services/updateRating";

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
    const serviceRequest = await getRating(id);
    return NextResponse.json(serviceRequest, { status: 200 });
  } catch (error) {
    console.error("Error fetching service request:", error);
    return NextResponse.json(
      { error: "Failed to retrieve service request" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { ratings, description } = await req.json();

  if (!id) {
    return NextResponse.json(
      { error: "Service request ID is required" },
      { status: 400 }
    );
  }

  if (!ratings || !description) {
    return NextResponse.json(
      { error: "Rating and description are required to update service request" },
      { status: 400 }
    );
  }

  try {
    const updatedServiceRequest = await updateRating(id, ratings, description);
    return NextResponse.json(updatedServiceRequest, { status: 200 });
  } catch (error) {
    console.error("Error updating service request:", error);
    return NextResponse.json(
      { error: "Failed to update service request" },
      { status: 500 }
    );
  }
}