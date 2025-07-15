"use server"

import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { CourseSchema, CourseSchemaType } from "@/lib/zodSchema";



export async function adminEditCourse(course: CourseSchemaType, courseId: string):Promise<ApiResponse> {

    try {
        const result = CourseSchema.safeParse(course);
        if (!result.success) {
            return {
                status: "error",
                message: "Invalid course data",
            };
        }

        await prisma.course.update({
            where: { id: courseId },
            data: result.data,
        });

        return {
            status: "success",
            message: "Course updated successfully",
        };

    } catch (error) {
        console.error("Error editing course:", error);
        return {
            status: "error",
            message: "Failed to edit course"
        };
        
    }
}