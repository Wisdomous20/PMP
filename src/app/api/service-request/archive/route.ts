import { NextRequest, NextResponse } from "next/server";
import getArchivedServiceRequests from "@/domains/service-request/services/getArchive";

export async function GET(req: NextRequest): Promise<NextResponse> {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId") || null;

    if (!userId) {
        return NextResponse.json(
            { error: "Missing required fields" },
            { status: 400 }
        );
    }

    try{
        const archive = await getArchivedServiceRequests(userId);
        return NextResponse.json(archive, { status: 200 });
    }catch(error){
        console.error("Error fetching archive:", error);
        return NextResponse.json(
            { error: "Failed to retrieve archive" },
            { status: 500 }
        );
    }
}