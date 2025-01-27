import { NextRequest, NextResponse } from "next/server";
import getPersonnelById from "@/domains/manpower-management/service/getPersonnelById";
import deletePersonnel from "@/domains/manpower-management/service/deletePersonnel";

export async function GET(req: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id } = params;
    if (!id) {
        return NextResponse.json(
            { error: "Personnel ID is required" },
            { status: 400 }
        );
    }
        try{
            const personnel = await getPersonnelById(id);
            return NextResponse.json(personnel, { status: 200 });
        }catch(error){
            console.error("Error fetching personnel:", error);
            return NextResponse.json(
                { error: "Failed to retrieve personnel" },
                { status: 500 }
            );
        }
}

export async function DELETE(req: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id } = params;
    if (!id) {
        return NextResponse.json(
            { error: "Personnel ID is required" },
            { status: 400 }
        );
    }
        try{
            const personnel = await deletePersonnel(id);
            return NextResponse.json(personnel, { status: 200 });
        }catch(error){
            console.error("Error fetching personnel:", error);
            return NextResponse.json(
                { error: "Failed to retrieve personnel" },
                { status: 500 }
            );
        }
}