import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import db from "@/db/drizzle";
import { chatFolders } from "@/db/schema";
import { folderCreateResponse } from "@/types";

export const POST = async () => {
    try {
        // const body = createFolderSchema.parse(await req.json()) as CreateFolderRequest;
        // console.log("bodyds", body);
        const { userId } = auth();

        if (!userId) {
            const response = folderCreateResponse.parse({
                error: "User Not Authenticated",
                message: undefined,
            })
            return NextResponse.json(response, { status: 422 });
        }

        const data = await db
            .insert(chatFolders)
            .values({
                userId: userId,
                name: "New Folder",
                createdAt: new Date(),
            })
            .returning();

        console.log("new folder ", data[0])
        const response = folderCreateResponse.parse({
            error: undefined,
            message: data[0]
        })

        console.log("response is NIRP123", response);
        return NextResponse.json(response);
    } catch (error) {
        const response = folderCreateResponse.parse({
            error: (error as Error).message,
            message: undefined,
        })
        return NextResponse.json(response, { status: 400 });
    }
};

export const GET = async () => {
    const { userId } = auth();
    if (!userId) {
        return NextResponse.json({ message: "not authenticated" }, { status: 400 });
    }
    const data = await db.query.chatFolders.findMany({
        where: eq(chatFolders.userId, userId),
        orderBy: (chatFolders, { desc }) => [desc(chatFolders.createdAt)]
    });

    return NextResponse.json(data);
};