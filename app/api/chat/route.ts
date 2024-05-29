import { StreamingTextResponse, AssistantResponse } from 'ai';
import { NextRequest } from 'next/server';
import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';

import db from '@/db/drizzle';
import { chatThreads } from '@/db/schema';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
})

export const runtime = 'edge'

interface ClientMessage {
  threadId: string | undefined;
  message: string;
  folderId: number;
}

export async function POST(req: NextRequest): Promise<StreamingTextResponse> {
  const body = await req.json() as ClientMessage;
  
  let threadId = body.threadId;
  let newThreadCreated = false;

  console.log(threadId, "threadId");
  
  if(!threadId){
    const newThread = await openai.beta.threads.create({});
    threadId = newThread.id;
    newThreadCreated = true;
  }

  const createdMessage = await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: body.message
  });

  if(newThreadCreated){
    const data = await db
    .insert(chatThreads)
    .values({
      threadId: threadId,
      folderId: body.folderId
    })
    .returning();

  console.log(data);
  }

  console.log("api... ", threadId, createdMessage);

  return AssistantResponse(
    { threadId, messageId: createdMessage.id },
    async ({ sendMessage }) => {
      const run = openai.beta.threads.runs.stream(threadId, {
        assistant_id: process.env.ASSISTANT_ID ??
          (() => {
            throw new Error("ASSISTANT_ID is not set")
          })(),
      });

      run
        .on('textCreated', () => {
          return process?.stdout?.write('\nassistant > ')
        })
        .on('textDelta', (textDelta) => sendMessage({
          id: uuidv4(),
          role: "assistant",
          content: [{ type: "text", text: { value: textDelta.value || "" } }]
        }))
        .on('toolCallCreated', (toolCall) => process?.stdout?.write(`\nassistant > ${toolCall.type}\n\n`))
        .on('toolCallDelta', (toolCallDelta) => {
          if (toolCallDelta.type === 'code_interpreter') {
            if (toolCallDelta?.code_interpreter?.input) {
              process?.stdout?.write(toolCallDelta.code_interpreter.input);
            }
            if (toolCallDelta?.code_interpreter?.outputs) {
              process?.stdout?.write("\noutput >\n");
              toolCallDelta.code_interpreter.outputs.forEach(output => {
                if (output.type === "logs") {
                  process?.stdout?.write(`\n${output.logs}\n`);
                }
              });
            }
          }
        });

      // Handling final status
      await new Promise((resolve, reject) => {
        run.on('textDone', resolve);
        run.on('error', reject);
      });

    }
  )
}


/**
 * 
 * const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages: [
      {
        role: 'system',
        content:
          `You are an all-knowing, expert teacher-like AI bot. When asked about any question or topic, you will teach the user in detail about the subject. Provide useful guides or resources for further study. If asked about a large topic, give a step-by-step roadmap for learning it, and suggest that the user ask you individually about each subtopic for more comprehensive answers.
          `
      },
    ]
  })

  const stream = OpenAIStream(response)
  return new StreamingTextResponse(stream)
 */