import { NextRequest } from 'next/server';
import OpenAI from 'openai';
import { fetchChatApiRequestValidator, fetchChatApiRequestResponse  } from "@/types";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || ''
})

export const runtime = 'edge'

interface ClientMessage {
    threadId: string | undefined;
    message: string;
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    try {
        const { threadId } = fetchChatApiRequestValidator.parse(body);
        const messages = await openai.beta.threads.messages.list(threadId);
        const formatedMessages = messages.data;

        const response = fetchChatApiRequestResponse.parse({
            error: undefined,
            messages: formatedMessages.map((msg: any) => ({
                id: msg.id,
                role: msg.role,
                content: msg.content.map((c: any) => c.text.value).join(" "),
                created_at: msg.created_at
            }))
        })

        return new Response(JSON.stringify(response), { status: 200 });
    } catch (error) {
        console.log("ERROR: ",error)
       const response = fetchChatApiRequestResponse.parse({
        error: (error as Error).message,
        message: undefined,
       });

       return new Response(JSON.stringify(response), { status: 422 });
    }
}