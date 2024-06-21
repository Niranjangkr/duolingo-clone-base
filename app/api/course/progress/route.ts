import db from "@/db/drizzle";
import { userCourseProgress, userCourses } from "@/db/schema";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

type values = {
    id: number;
}

export async function POST(request: NextRequest) {
    const { id } = (await request.json()) as values;
    console.log(id, "id12");
    try {
        const { userId } = auth();
        if (!id || !userId) {
            return NextResponse.json({ success: false, message: "id not provided" }, { status: 402 });
        }

        const data = await db
            .query.userCourseProgress.findFirst({
                where: eq(userCourseProgress.userCourseId, id),
            });

        return NextResponse.json({
            success: true,
            data: data
        })
    } catch (error) {
        console.log("Error: ", error);
        return NextResponse.json({ error: error }, { status: 500 })
    }
}