import { NextRequest, NextResponse } from "next/server";
import removePersonnelFromTask from "@/domains/personnel-management/service/removePersonnelFromTask";

export async function POST(req: NextRequest) {
  try {
    const { taskId, personnelId } = await req.json();
    if (!taskId || !personnelId) {
      return NextResponse.json(
        { error: "Please provide taskId and personnelId" },
        { status: 400 }
      );
    }

    await removePersonnelFromTask(taskId, personnelId);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error removing personnel assignment:", error);
    return NextResponse.json(
      { error: "Failed to remove personnel assignment" },
      { status: 500 }
    );
  }
}
