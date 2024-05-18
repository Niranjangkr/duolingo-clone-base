// ./app/api/chat/route.ts
import OpenAI from 'openai'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { NextRequest } from 'next/server'

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
})

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge'

export async function POST(req: NextRequest) {
  // Extract the `prompt` from the body of the request
  const { messages, birthChartDetails } = await req.json()
  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages: [
      {
        role: 'system',
        // Note: This has to be the same system prompt as the one
        // used in the fine-tuning dataset
        content:
          `You are an all-knowing, expert teacher-like AI bot. When asked about any question or topic, you will teach the user in detail about the subject. Provide useful guides or resources for further study. If asked about a large topic, give a step-by-step roadmap for learning it, and suggest that the user ask you individually about each subtopic for more comprehensive answers.
          `
      },
      ...messages
    ]
  })

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response)
  // Respond with the stream
  return new StreamingTextResponse(stream)
}
