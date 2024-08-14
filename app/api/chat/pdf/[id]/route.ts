import db from "@/db/drizzle";
import { pdfChatThreads } from "@/db/schema";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req:NextRequest, { params } : { params: { id:number }}) => {
    const { userId } = auth();
    try {
      if (!userId) {
        return NextResponse.json(
          { message: "not authenticated" },
          { status: 400 }
        );
      }
      const data = await db.query.pdfChatThreads.findMany({
        where: eq(pdfChatThreads.folderId, params.id),
        orderBy: (pdfChatThreads, { desc }) => [desc(pdfChatThreads.createdAt)],
      });
  
      return NextResponse.json({success: true, data: data}, {status: 200});
    } catch (error) {
      console.error(error);
      return NextResponse.json({success: false, error}, {status: 500});
    }
  };