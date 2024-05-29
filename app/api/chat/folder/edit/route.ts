import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

import db from "@/db/drizzle";
import { chatFolders } from "@/db/schema";

type values = {
    name: string,
    id: number,
}


export const POST = async (req: NextRequest) => {
    try {
        const { userId } = auth();
        const { name, id } = (await req.json()) as values;

        if (!userId) {
            return NextResponse.json({message: "Not Authenticated"}, { status: 422 });
        }

        if(!name){
            return NextResponse.json({ message: "Invalid Values"} , { status: 422 })
        }

        const data = await db.update(chatFolders)
            .set({ name: name})
            .where(eq(chatFolders.id, id))
            .returning()

        return NextResponse.json({ message: "success", data: data }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "failed", error }, { status: 500 });
    }
};