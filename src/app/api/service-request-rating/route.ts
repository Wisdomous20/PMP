import { NextRequest, NextResponse } from "next/server";
import createRating from "@/domains/service-request-rating/services/createRating";

export async function POST(req: NextRequest): Promise<NextResponse> {
    try{
        const { serviceRequestId, rating, description } = await req.json();

        if ( !serviceRequestId || !rating || !description) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const newServiceRequestRating = await createRating(
            serviceRequestId,
            rating,
            description
        );

        return NextResponse.json(newServiceRequestRating, { status: 201 });
    }catch(error){
        console.error("Error handling POST request:", error);
        return NextResponse.json(
            { error: "Failed to create service request rating" },
            { status: 500 }
        );
    }
}
