import db from "@/db/drizzle";
import { pdfChatFolder } from "@/db/schema";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
    const { name, id } = await request.json();
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!id || !name) {
        return NextResponse.json({ message: "Invalid Values" }, { status: 422 });
    }

    try {

        const data = await db.update(pdfChatFolder)
            .set({ name: name })
            .where(eq(pdfChatFolder.id, id))
            .returning();

        if (data.length === 0) {
            return NextResponse.json({ message: "Update failed", success: false }, { status: 500 });
        }

        return NextResponse.json({ data: data[0], success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error instanceof Error ? error.message : "Internal Server Error", success: false }, { status: 500 });
    }
}
