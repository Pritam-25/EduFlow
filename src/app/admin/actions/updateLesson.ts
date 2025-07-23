"use server"

import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { LessonSchema, LessonSchemaType } from "@/lib/zodSchema";



export async function updateLesson(values: LessonSchemaType, lessonId: string): Promise<ApiResponse> {

  try {
    const lesson = LessonSchema.safeParse(values);

    if (!lesson.success) {
      return {
        status: "error",
        message: "Invalid lesson data",
      };
    }

    await prisma.lesson.update({
      where:{id:lessonId},
      data: {
        title: lesson.data.title,
        description: lesson.data.description,
        videokey: lesson.data.videoKey,
        thumbnailkey: lesson.data.thumbnailKey,
      },
    })

    return {
      status: "success",
      message: "Lesson updated successfully",
    }
  } catch (error) {
    console.error("Error updating lesson:", error);
    return {
      status: "error",
      message: "Failed to update lesson",
    };
  }
} 