import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import fs from "fs";
import { writeFile, unlink } from "fs/promises";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.LEARN_PDF_OPENAI_API_KEY || ''
})

const ASSISTANT_ID = process.env.ASSISTANT_PDF_ID;

export async function POST(req: NextRequest) {
    try {
        const data = await req.formData();
        const file: File | null = data.get('file') as unknown as File;

        if (!file) {
            return NextResponse.json({ success: false, message: 'No file provided' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const path = join('/', 'tmp', file.name);
        await writeFile(path, buffer);

        const openaiFile = await openai.files.create({
            file: fs.createReadStream(path),
            purpose: 'assistants'
        });

        console.log(openaiFile, "openaiFile");

        // Create thread
        const thread = await openai.beta.threads.create({
            messages: [
                {
                    role: "assistant",
                    content: "Hi! I have reviewed and understood the contents of the attached PDF. Feel free to ask me anything about it to learn more about the topic.",
                    attachments: [{ file_id: openaiFile.id, tools: [{ type: "file_search" }] }],
                }
            ]
        });

        console.log(thread, thread.tool_resources?.file_search, "thread");

        // Clean up temporary file
        await unlink(path)

        return NextResponse.json({ success: true, thread_id: thread.id, fileName: openaiFile.filename }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: error }, { status: 500 });
    }
}
