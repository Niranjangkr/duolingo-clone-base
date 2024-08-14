import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

import db from "@/db/drizzle";
import { pdfChatThreads } from "@/db/schema";
import { newPdfChatRequest } from "@/types";
import { auth } from "@clerk/nextjs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const body = newPdfChatRequest.parse(await req.json());
    const { userId } = auth();
    const threadId = body.threadId;
    const key = body.key;
    const name = body.name;
    const pdfFolderId = body.pdfFolderId

    if (!threadId && !name && !userId) {
      return NextResponse.json({ message: "Invalid values" }, { status: 400 });
    } else {
      const data = await db
        .insert(pdfChatThreads)
        .values({
          threadId: threadId,
          userId: userId!,
          name: name,
          key: key,
          folderId: pdfFolderId
        })
        .returning();

      return NextResponse.json({ message: data }, { status: 200 });
    }
  } catch (error) {
    NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
