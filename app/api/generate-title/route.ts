import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

type values = {
    context: string;
}
export async function POST(request: NextRequest) {
    const { context } = (await request.json()) as values;
     
    try {
        const url = 'https://api.openai.com/v1/chat/completions'
        const headers = {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${process.env.LEARN_PDF_OPENAI_API_KEY}`
        }
        const data = {
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    "role": "system", "content": `
                    You are a expert title generator, you will be provided with the first two messages exchanged in a chat. Based on these messages, generate a title for the chat thread. The title should capture the essence of the conversation and should not exceed four words.
                    ` },
                { "role": "user", "content": context },
            ]
        }
    
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const response = await axios.post(url, data, { headers: headers });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const parsRes:string = `${response?.data?.choices[0]?.message?.content}`;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const parsedResponse = parsRes;
        return NextResponse.json({
            success: true,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            data: parsedResponse
        })
    } catch (error) {
        console.log("Error: ", error);
        return NextResponse.json({ error: error }, { status: 500 })
    }
}