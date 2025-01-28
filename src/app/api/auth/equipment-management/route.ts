import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
    try{
        const {name, department} = await req.json();

        if(!name || !department){
            return NextResponse.json(
                {error: "Missing required fields"},
                {status: 400}
            );
        }

        const newEquipment = await createEquipment(name, department);

        return NextResponse.json(newEquipment, {status: 201});
    }catch(error){
        console.error("Error handling POST request:", error);
        return NextResponse.json(
            {error: "Failed to create equipment"},
            {status: 500}
        );
    }
}