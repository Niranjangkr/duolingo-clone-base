import db from "@/db/drizzle";
import { pdfChatFolder } from "@/db/schema";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const { name } = await request.json();
  const { userId } = auth();

  try {
    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized request", success: false },
        { status: 400 }
      );
    }

    const data = await db
      .insert(pdfChatFolder)
      .values({
        userId: userId,
        name: name
      })
      .returning();

    return NextResponse.json({ data: data, success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "servor error", success: false },
      { status: 500 }
    );
  }
};

export const GET = async (request: NextRequest) => {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json(
      { message: "Unauthorized request", success: false },
      { status: 400 }
    );
  }

  const data = await db.query.pdfChatFolder.findMany({
    where: eq(pdfChatFolder.userId, userId),
    orderBy: (pdfChatFolder, { desc }) => [desc(pdfChatFolder.createdAt)],
  });

  if (data.length <= 0) {
    const data = await db
      .insert(pdfChatFolder)
      .values({
        userId: userId,
      })
      .returning();

    return NextResponse.json({ data: data, success: true }, { status: 200 });
  }

  return NextResponse.json({ data: data, success: true }, { status: 200 });
};
