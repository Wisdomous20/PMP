import { NextRequest, NextResponse } from "next/server";
import getPersonnelByDepartment from "@/domains/manpower-management/services/getPersonnelByDepartment";


export async function GET(
    req: NextRequest,
    { params }: { params: { department: string } }
    ) {
    const { department } = params;
    
    if (!department) {
        return NextResponse.json(
        { error: "Department is required" },
        { status: 400 }
        );
    }
    
    try {
        const personnel = await getPersonnelByDepartment(department);
        return NextResponse.json(personnel, { status: 200 });
    } catch (error) {
        console.error("Error fetching personnel:", error);
        return NextResponse.json(
        { error: "Failed to retrieve personnel" },
        { status: 500 }
        );
    }
    }