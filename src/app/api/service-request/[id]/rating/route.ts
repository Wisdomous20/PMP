import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    const serviceRequestId = params.id;

    if (!serviceRequestId) {
      return NextResponse.json(
        { error: "Service request ID is required" },
        { status: 400 }
      );
    }

    const existingRating = await prisma.serviceRequestRating.findUnique({
      where: { serviceRequestId },
      include: {
        questions: true,
      },
    });

    if (!existingRating) {
      return NextResponse.json(
        { error: "No rating found for this service request" },
        { status: 404 }
      );
    }

    const transformedRating = {
      id: existingRating.id,
      serviceRequestId: existingRating.serviceRequestId,
      ratings: existingRating.ratings,
      description: existingRating.description,
      satisfaction: existingRating.questions.find(q => q.question === "How satisfied are you?")?.answer,
      feedback: existingRating.questions.find(q => q.question === "Additional feedback")?.answer,
      startOnTime: existingRating.questions.find(q => q.question === "Did the project start on time?")?.answer,
      startReason: existingRating.questions.find(q => q.question === "Reason for delay")?.answer,
      achievedResults: existingRating.questions.find(q => q.question === "Did the plan achieve the desired results?")?.answer,
      resultReason: existingRating.questions.find(q => q.question === "Reason for not achieving results")?.answer,
    };

    return NextResponse.json(transformedRating, { status: 200 });
  } catch (error) {
    console.error("Error fetching rating:", error);
    return NextResponse.json(
      { error: "Failed to fetch rating" },
      { status: 500 }
    );
  }
}