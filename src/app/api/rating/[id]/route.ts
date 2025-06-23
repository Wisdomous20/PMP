import { NextRequest, NextResponse } from "next/server";
import getRatingById from "@/domains/rating/service/getRatingById";

export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const { id } = params;

    if (!id) {
        return NextResponse.json(
            { error: "Service request ID is required" },
            { status: 400 }
        );
    }

    try {
        const ratingData = await getRatingById(id); 

        return NextResponse.json(ratingData, { status: 200 });
    } catch (error) {
        console.error("Error fetching rating data:", error);
        return NextResponse.json(
            { error: "Failed to retrieve rating data" },
            { status: 500 }
        );
    }
}