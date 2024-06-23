import db from "@/db/drizzle";
import { NextResponse } from "next/server";

export const GET = async () => {
    const data = await db.query.userCourses.findMany({
        orderBy: (userCourses, { desc }) => [desc(userCourses.createdAt)]
    });

    return NextResponse.json(data);
};