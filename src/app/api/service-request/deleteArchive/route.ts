import {NextRequest, NextResponse} from "next/server";

export async function DELETE(req: NextRequest) {
    const {serviceRequestId} = await req.json();

    if (!serviceRequestId) {
        return NextResponse.json(
            {error: "Service request ID is required"},
            {status: 400}
        );
    }

    try {
        const status = await deleteArchive(serviceRequestId);

        return NextResponse.json(
            {message: `Archived status added successfully`, status},
            {status: 200}
        );
    } catch (error) {
        console.error(`Error adding archived status:`, error);
        return NextResponse.json(
            {error: `Failed to add archived status`},
            {status: 500}
        );
    }
}