import { OpenAIStream, StreamingTextResponse, AssistantResponse } from 'ai';
import { NextRequest } from 'next/server';
import OpenAI from 'openai';
import { TextContentBlock } from 'openai/resources/beta/threads/messages.mjs';
import { Run } from 'openai/resources/beta/threads/runs/runs.mjs';
import { v4 as uuidv4 } from 'uuid';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
})

export const runtime = 'edge'

interface ClientMessage {
  threadId: string | undefined;
  message: string;
}

export async function POST(req: NextRequest): Promise<StreamingTextResponse> {
  const body = await req.json() as ClientMessage;

  const threadId = body.threadId ?? (await openai.beta.threads.create({})).id;
  const createdMessage = await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: body.message
  });

  console.log("api... ", threadId, createdMessage);

  return AssistantResponse(
    { threadId, messageId: createdMessage.id },
    async ({ sendMessage }) => {
      const run = await openai.beta.threads.runs.stream(threadId, {
        assistant_id: process.env.ASSISTANT_ID ??
          (() => {
            throw new Error("ASSISTANT_ID is not set")
          })(),
      });

      // const messagesTest = await openai.beta.threads.messages.list(threadId);
      // console.log("messageTest", messagesTest.data, "raw", messagesTest);

      run
        .on('textCreated', (text) => {
          return process?.stdout?.write('\nassistant > ')
        })
        .on('textDelta', (textDelta, snapshot) => sendMessage({
          id: uuidv4(),
          role: "assistant",
          content: [{ type: "text", text: { value: textDelta.value || "" } }]
        }))
        .on('toolCallCreated', (toolCall) => process?.stdout?.write(`\nassistant > ${toolCall.type}\n\n`))
        .on('toolCallDelta', (toolCallDelta, snapshot) => {
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