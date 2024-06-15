import db from "@/db/drizzle";
import { userCourses } from "@/db/schema";
import { auth } from "@clerk/nextjs";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
const PORTKEY = process.env.PORTKEY;

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
            "https://api.portkey.ai/v1/prompts/pp-create-cou-3f88c6/completions",
            {
                variables: {
                    topic: topic
                },
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "x-portkey-api-key": PORTKEY,
                },
            }
        );

        const jsonData = result.data.choices[0].message.content;

        // save in db
        const data = await db
            .insert(userCourses)
            .values({
                courseData: jsonData,
                userId: userId,
                createdAt: new Date(),
            })
            .returning()
        
        return NextResponse.json({
            success: true,
            data: data
        })
    } catch (error) {
        console.log("Error: ", error);
        return NextResponse.json({ error: error }, { status: 500 })
    }
}