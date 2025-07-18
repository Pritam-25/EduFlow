"use server";
import { ApiResponse } from "@/lib/types";
import { prisma } from "@/lib/db";
import {  LessonSchema, LessonSchemaType } from "@/lib/zodSchema";
import { log } from "console";
import { revalidatePath } from "next/cache";
import z from "zod";

export async function CreateLesson(data: LessonSchemaType): Promise<ApiResponse> {
  console.log("createChapter called with:", data);
  try {
    // Validate the data against the LessonSchema
    const validatedData = LessonSchema.parse(data);

    if (!validatedData.courseId) {
      return { status: "error", message: "invalid lesson data: Course ID is required" };
    }

    await prisma.$transaction(async (tx) => {
      // finding the current max lesson position
      const maxPosition = await tx.lesson.aggregate({
        _max: {
          position: true,
        },
        where: {
          chapterId: validatedData.chapterId,
        },
      });

      log("Max position found:", maxPosition);

      // Create the lesson in the database
      const lesson = await tx.lesson.create({
        data: {
          position: (maxPosition._max.position || 0) + 1, // Increment the max position by 1
          title: validatedData.title,
          chapterId: validatedData.chapterId,
          description: validatedData.description,
          thumbnailkey: validatedData.thumbnailKey,
          videokey: validatedData.videoKey,
        },
      });
      console.log("Created lesson:", lesson);
    });

    revalidatePath(`/admin/courses/${validatedData.courseId}`);

    // Here you would typically call your database or API to create the lesson
    console.log("Creating lesson with data:", validatedData);

    // Simulate a successful creation response
    return { status: "success", message: "Lesson created successfully" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle validation errors
      return { status: "error", message: error.errors.map(e => e.message).join(", ") };
    }
    console.error("Lesson creation error:", error.message);

    // Handle other errors
    return { status: "error", message: "An unexpected error occurred while creating the lesson" };
  }
}