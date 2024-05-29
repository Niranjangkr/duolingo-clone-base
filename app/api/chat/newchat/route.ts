import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

import db from '@/db/drizzle';
import { chatThreads } from '@/db/schema';
import { newChatRequest } from '@/types';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || ''
})

export const runtime = 'edge'

export async function POST(req: NextRequest) {
    try {
        const body = newChatRequest.parse(await req.json());
        const folderId = body.folderId;

        if (!folderId) {
            return NextResponse.json({ message: "Invalid values" }, { status: 400 });
        }

        const newThread = await openai.beta.threads.create({});
        const threadId = newThread.id;

        const data = await db
            .insert(chatThreads)
            .values({
                threadId: threadId,
                folderId: body.folderId
            })
            .returning();

        return NextResponse.json({ message: data }, { status: 200 })
    } catch (error) {
        NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }

}