"use server";
import { ApiResponse } from "@/lib/types";
import { ChapterSchema, ChapterSchemaType } from "@/lib/zodSchema";
import { log } from "console";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import z from "zod";

export async function createChapter(data: ChapterSchemaType): Promise<ApiResponse> {
   console.log("createChapter called with:", data);
  try {
    // Validate the data against the ChapterSchema
    const validatedData = ChapterSchema.parse(data);

    if (!validatedData.courseId) {
      return { status: "error", message: "invalid chapter data: Course ID is required" };
    }

    await prisma.$transaction(async (tx) => {
      // finding the current max chapter position
      const maxPosition = await tx.chapter.aggregate({
        _max: {
          position: true,
        },
        where: {
          courseId: validatedData.courseId,
        },
      });

      log("Max position found:", maxPosition);

      // Create the chapter in the database
      const chapter = await tx.chapter.create({
        data: {
          position: (maxPosition._max.position || 0) + 1, // Increment the max position by 1
          title: validatedData.title,
          courseId: validatedData.courseId,
        },
      });
      console.log("Created chapter:", chapter);
    });

    revalidatePath(`/admin/courses/${validatedData.courseId}/edit`);

    // Here you would typically call your database or API to create the chapter
    console.log("Creating chapter with data:", validatedData);

    // Simulate a successful creation response
    return { status: "success", message: "Chapter created successfully" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle validation errors
      return { status: "error", message: error.errors.map(e => e.message).join(", ") };
    }
    // Handle other errors
    return { status: "error", message: "An unexpected error occurred while creating the chapter" };
  }
}