import { NextRequest, NextResponse } from "next/server";
import addPersonnelToImplementationPlan from "@/domains/personnel-management/service/addPersonnelToImplementationPlan";

export async function POST(req: NextRequest) {
    try{
        const {taskId, personnelId} = await req.json();
        console.log(taskId, personnelId)
        if(!taskId || !personnelId){
            return NextResponse.json(
                {error: "Please provide implementationPlanId and personnelId"},
                {status: 400}
            )
        }

        const personnelAssignment = await addPersonnelToImplementationPlan(taskId, personnelId);
        return NextResponse.json(personnelAssignment, { status: 201 });

    }catch(error){
        console.error("Error assigning personnel:", error);
        return NextResponse.json(
            {error: "Failed to assign personnel"},
            {status: 500}
        )
    }
}