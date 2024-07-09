import db from "@/db/drizzle";
import { userCourseProgress, userCourses } from "@/db/schema";
import { auth } from "@clerk/nextjs";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
// const PORTKEY = process.env.PORTKEY;
const ATHINA = process.env.ATHINA;

type values = {
    topic: string;
}

export async function POST(request: NextRequest) {
    const { topic } = (await request.json()) as values;
    try {
        const { userId } = auth();
        if (!topic || !userId) {
            return NextResponse.json({ success: false, message: "topic not provided" }, { status: 402 });
        }

        const result = await axios.post(
            // "https://api.portkey.ai/v1/prompts/pp-create-cou-3f88c6/completions",
            "https://api.athina.ai/api/v1/prompt/course-generator/run",
            {
                variables: {
                    topic: topic
                },
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    // "x-portkey-api-key": PORTKEY,
                    "athina-api-key": ATHINA
                },
            }
        );

        console.log("codeGeas", result);
        const jsonData = result.data.data.prompt?.prompt_response;

        // save in db
        const data = await db
            .insert(userCourses)
            .values({
                courseData: jsonData,
                userId: userId,
                createdAt: new Date(),
            })
            .returning()

        await db
            .insert(userCourseProgress)
            .values({
                userCourseId: data[0].id,
                userId: userId,
                level: "basic",
                questionIndex: 0,
            })

        return NextResponse.json({
            success: true,
            data: data
        })
    } catch (error) {
        console.log("Error: ", error);
        return NextResponse.json({ error: error }, { status: 500 })
    }
}