"use server";

import { auth } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { MAX_HEARTS } from "@/constants";
import db from "@/db/drizzle";
import { getUserCourseProgressById } from "@/db/queries";
import { challengeProgress, userCourseProgress, userProgress } from "@/db/schema";
import { Level } from "@/types";

export const upsertCourseProgress = async (userProgressId: number, level: Level, questionIndex: number) => {
  const { userId } = auth();

  if (!userId) throw new Error("Unauthorized.");

  const currentUserCourseProgress = await getUserCourseProgressById(userProgressId);

  if (!currentUserCourseProgress) throw new Error("User progress not found.");


  await db
    .update(userCourseProgress)
    .set({
      level: level,
      questionIndex: questionIndex,
    })
    .where(eq(userCourseProgress.id, userProgressId));

  revalidatePath("/learn2");
  revalidatePath("/course2");
};
