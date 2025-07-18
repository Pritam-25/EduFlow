"use server";

import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function deleteChapter({chapterId, courseId}: {chapterId: string, courseId: string}): Promise<ApiResponse> {

  try {
    const courseWithChapters = await prisma.course.findUnique({
      where: {id: courseId},
      select:{
        chapters:{
          orderBy:{
            position: "asc"
          },
          select:{
            id: true,
            position: true
          }
        }
      }
    })


    if (!courseWithChapters) {
      return {
        status: "error",
        message: "Course not found",
      };
    }
    

    const chapters = courseWithChapters.chapters;

    const chapterToDelete = chapters.find(chapter => chapter.id === chapterId);
    if (!chapterToDelete) {
      return {
        status: "error",
        message: "Chapter not found",
      };
    }

    // get remaining chapters after deletion
    const remainingChapters = chapters.filter(chapter => chapter.id !== chapterId);

    const updates = remainingChapters.map((chapter, index) => {
      return prisma.chapter.update({
        where: { id: chapter.id },
        data: { position: index + 1 }
      });
    });

   // delete the chapter
   await prisma.$transaction([
    ...updates,
    prisma.chapter.delete({
      where:{
        id:chapterId,
      }
    })
   ])

   // revalidate the course cache
   revalidatePath(`/admin/courses/${courseId}/edit`);


    return{
      status: "success",
      message: "Chapter deleted successfully",
    }
  } catch (error) {
    console.error("Error deleting chapter:", error);
    return {
      status: "error",
      message: "Failed to delete chapter",
    };
    
  }
}