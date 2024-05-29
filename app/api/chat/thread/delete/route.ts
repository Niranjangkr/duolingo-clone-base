import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import db from "@/db/drizzle";
import { chatThreads } from "@/db/schema";

type values = {
    id: number
}

export const POST = async (req: NextRequest) => {
    try {
        const { id } = (await req.json()) as values;
        const { userId } = auth();

        if (!userId) {
            return NextResponse.json({ message: "Not Authenticated" }, { status: 422 });
        }
        if (!id) {
            return NextResponse.json({ message: "Invalid Values" }, { status: 422 })
        }

        const res = await db.delete(chatThreads)
            .where(eq(chatThreads.id, id));

        return NextResponse.json({ message: "success", data: res }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "failed", error }, { status: 500 });
    }
}