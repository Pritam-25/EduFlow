"use server";

import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function deleteCourse({courseId}: {courseId: string}): Promise<ApiResponse> {

  try {
    await prisma.course.delete({
      where: {
        id: courseId,
      },
    });

    // revalidate the course cache
    revalidatePath(`/admin/courses`);


    return{
      status: "success",
      message: "Course deleted successfully",
    }
  } catch (error) {
    console.error("Error deleting course:", error);
    return {
      status: "error",
      message: "Failed to delete course",
    };
    
  }
}