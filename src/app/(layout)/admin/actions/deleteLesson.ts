"use server";

import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function deleteLesson({lessonId, chapterId, courseId}: {lessonId: string, chapterId: string, courseId: string}): Promise<ApiResponse> {

  try {
    const chapterWithLessons = await prisma.chapter.findUnique({
      where: { id: chapterId },
      select: {
        lessons: {
          orderBy:{
            position: "asc"
          },
          select: {
            id: true,
            position: true
          }
        }
      }
    });

    if (!chapterWithLessons) {
      return {
        status: "error",
        message: "Chapter not found",
      };
    }

    const lessons = chapterWithLessons.lessons;

    const lessonToDelete = lessons.find(lesson => lesson.id === lessonId);

    if (!lessonToDelete) {
      return {
        status: "error",
        message: "Lesson not found",
      };
    }

    const remainingLessons = lessons.filter(lesson => lesson.id !== lessonId);

    
    const updates = remainingLessons.map((lesson, index) => {
      return prisma.lesson.update({
        where: { id: lesson.id },
        data: { position: index + 1 }
      });
    });

    await prisma.$transaction([
      ...updates,
      prisma.lesson.delete({
        where: { id: lessonId }
      })
    ]);


    // revalidate the lesson cache
    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Lesson deleted successfully",
    }
  } catch (error) {
    console.error("Error deleting lesson:", error);
    return {
      status: "error",
      message: "Failed to delete lesson",
    };
    
  }
}