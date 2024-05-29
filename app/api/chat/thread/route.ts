import { type NextRequest, NextResponse } from "next/server";

import db from "@/db/drizzle";
import { chatThreads } from "@/db/schema";

export const POST = async (req: NextRequest) => {
  const body = (await req.json()) as typeof chatThreads.$inferSelect;
  
  const data = await db
    .insert(chatThreads)
    .values({
      ...body,
    })
    .returning();

  return NextResponse.json(data[0]);
};
