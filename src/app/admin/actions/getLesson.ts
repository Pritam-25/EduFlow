"use server";

import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export async function getLesson(lessonId: string) {

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select:{
      id: true,
      title: true,
      position:true,
      videokey:true,
      description: true,
      thumbnailkey: true,
    }
  });

  if (!lesson) {
    return notFound();
  }

  return lesson;
}

export type LessonType = Awaited<ReturnType<typeof getLesson>>;