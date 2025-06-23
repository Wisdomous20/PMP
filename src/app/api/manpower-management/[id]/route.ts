import { NextRequest, NextResponse } from "next/server";
import getPersonnelById from "@/domains/personnel-management/service/getPersonnelById";
import deletePersonnel from "@/domains/personnel-management/service/deletePersonnel";
import updatePersonnel from "@/domains/personnel-management/service/updatePersonnel";

export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
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

export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
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

export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const { id } = params;

    try {
        const { name, department, position } = await req.json();

        if (!id || !name || !department || !position) {
            return NextResponse.json(
                { error: "ID, name, and department are required" },
                { status: 400 }
            );
        }
        const updatedPersonnel = await updatePersonnel(id, name, department, position);
        return NextResponse.json(updatedPersonnel, { status: 200 });
    } catch (error) {
        console.error("Error updating personnel:", error);
        return NextResponse.json(
            { error: "Failed to update personnel" },
            { status: 500 }
        );
    }
}
