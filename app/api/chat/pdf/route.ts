import { StreamingTextResponse, AssistantResponse } from "ai";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { v4 as uuidv4 } from "uuid";

import db from "@/db/drizzle";
import { chatThreads, pdfChatThreads } from "@/db/schema";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";

const openai = new OpenAI({
  apiKey: process.env.LEARN_PDF_OPENAI_API_KEY || "",
});

export const runtime = "edge";

interface ClientMessage {
  threadId: string | undefined;
  message: string;
  folderId?: number;
}

export async function POST(req: NextRequest): Promise<StreamingTextResponse> {
  const body = (await req.json()) as ClientMessage;

  let threadId = body.threadId;

  console.log(threadId, "threadId");

  if (!threadId) {
    // const newThread = await openai.beta.threads.create({});
    // threadId = newThread.id;
    // newThreadCreated = true;
    return Response.json(
      {
        message: "Thread ID is required",
      },
      { status: 400 }
    );
  }

  const createdMessage = await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: body.message,
  });

  return AssistantResponse(
    { threadId, messageId: createdMessage.id },
    async ({ sendMessage }) => {
      const run = openai.beta.threads.runs.stream(threadId, {
        assistant_id:
          process.env.ASSISTANT_PDF_ID ??
          (() => {
            throw new Error("ASSISTANT_ID is not set");
          })(),
      });

      run
        .on("textCreated", () => {
          return process?.stdout?.write("\nassistant > ");
        })
        .on("textDelta", (textDelta) =>
          sendMessage({
            id: uuidv4(),
            role: "assistant",
            content: [{ type: "text", text: { value: textDelta.value || "" } }],
          })
        )
        .on("toolCallCreated", (toolCall) =>
          process?.stdout?.write(`\nassistant > ${toolCall.type}\n\n`)
        )
        .on("toolCallDelta", (toolCallDelta) => {
          if (toolCallDelta.type === "code_interpreter") {
            if (toolCallDelta?.code_interpreter?.input) {
              process?.stdout?.write(toolCallDelta.code_interpreter.input);
            }
            if (toolCallDelta?.code_interpreter?.outputs) {
              process?.stdout?.write("\noutput >\n");
              toolCallDelta.code_interpreter.outputs.forEach((output) => {
                if (output.type === "logs") {
                  process?.stdout?.write(`\n${output.logs}\n`);
                }
              });
            }
          }
        });

      // Handling final status
      await new Promise((resolve, reject) => {
        run.on("textDone", resolve);
        run.on("error", reject);
      });
    }
  );
}

export const GET = async () => {
  const { userId } = auth();
  try {
    if (!userId) {
      return NextResponse.json(
        { message: "not authenticated" },
        { status: 400 }
      );
    }
    const data = await db.query.pdfChatThreads.findMany({
      where: eq(pdfChatThreads.userId, userId),
      orderBy: (pdfChatThreads, { desc }) => [desc(pdfChatThreads.createdAt)],
    });

    return NextResponse.json({success: true, data: data}, {status: 200});
  } catch (error) {
    console.error(error);
    return NextResponse.json({success: false, error}, {status: 500});
  }
};
