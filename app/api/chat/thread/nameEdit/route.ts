import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import db from "@/db/drizzle";
import { chatThreads } from "@/db/schema";

type values = {
    id: string;
    name: string;
} 

export const POST = async (req: NextRequest) => {
    try {
        const { id, name } = (await req.json()) as values;
        const { userId } = auth();

        if (!userId) {
            return NextResponse.json({ message: "Not Authenticated" }, { status: 422 });
        }
        if (!id) {
            return NextResponse.json({ message: "Invalid Values" }, { status: 422 })
        }

        const res = await db.update(chatThreads)
            .set({ name: name })
            .where(eq(chatThreads.threadId, id))
            .returning();

        return NextResponse.json({ message: "success", data: res }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "failed", error }, { status: 500 });
    }
}