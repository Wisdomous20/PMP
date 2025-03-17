import { NextRequest, NextResponse } from "next/server";
import addRating from "@/domains/service-request/services/addRating";

export async function POST(req: NextRequest) {
  const { serviceRequestId, rating, description, ratingData } = await req.json();

  if (!serviceRequestId) {
    return NextResponse.json(
      { error: "Service request ID is required" },
      { status: 400 }
    );
  }

  try {
    const status = await addRating(serviceRequestId, rating, description, ratingData);

    return NextResponse.json(
      { message: `Rating status added successfully`, status },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error adding rating status:`, error);
    return NextResponse.json(
      { error: `Failed to add rating status` },
      { status: 500 }
    );
  }
}