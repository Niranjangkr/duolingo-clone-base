import db from "@/db/drizzle";
import { userCourses } from "@/db/schema";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const GET = async () => {
    const { userId } = auth();
    if (!userId) {
        return NextResponse.json({ message: "not authenticated" }, { status: 400 });
    }
    const data = await db.query.userCourses.findMany({
        where: eq(userCourses.userId, userId),
        orderBy: (userCourses, { desc }) => [desc(userCourses.createdAt)]
    });

    return NextResponse.json(data);
};