import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest,
    {params}: {params: {id: string}}
): Promise<NextResponse> {
    const {id} = params;

    if(!id){
        return NextResponse.json(
            {error: "Equipment ID is required"},
            {status: 400}
        );
    }

    try{
        const equipment = await getEquipment(id);
        if(!equipment){
            return NextResponse.json(
                {error: "Equipment not found"},
                {status: 404}
            );
        }
        return NextResponse.json(equipment, {status: 200});
}catch(error){
    console.error("Error retrieving equipment:", error);
    return NextResponse.json(
        {error: "Failed to retrieve equipment"},
        {status: 500}
    );
}
}