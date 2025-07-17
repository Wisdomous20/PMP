import { NextRequest, NextResponse } from "next/server";
import { deleteArchive } from "@/lib/archive/delete-archive";

export async function DELETE(req: NextRequest) {
  // Authorization check
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    // Call deleteArchive to delete records older than 5 years
    const result = await deleteArchive();

    return NextResponse.json(
      { message: `Archived records older than 5 years deleted successfully`, result },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error deleting old archives:`, error);
    return NextResponse.json(
      { error: `Failed to delete old archives` },
      { status: 500 }
    );
  }
}