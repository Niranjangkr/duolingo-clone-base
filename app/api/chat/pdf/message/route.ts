import { NextRequest } from 'next/server';
import OpenAI from 'openai';

import { fetchChatApiRequestResponse, FetchChatApiRequest  } from "@/types";

const openai = new OpenAI({
    apiKey: process.env.LEARN_PDF_OPENAI_API_KEY || ''
})

export const runtime = 'edge'

export async function POST(req: NextRequest) {
    const { threadId } = (await req.json()) as FetchChatApiRequest;
    try {
        const messages = await openai.beta.threads.messages.list(threadId);
        const formatedMessages: OpenAI.Beta.Threads.Messages.Message[] = messages.data;

        const response = fetchChatApiRequestResponse.parse({
            error: undefined,
            messages: formatedMessages.map((msg) => ({
                id: msg.id,
                role: msg.role,
                content: msg.content.map((c) => {
                    if(c.type == "text"){
                        return c.text.value
                    }else{
                        return "";
                    }
                }).join(" "),
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