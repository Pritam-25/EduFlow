"use server"

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { CourseSchema, CourseSchemaType } from "@/lib/zodSchema"
import { headers } from "next/headers";

export async function createCourseAction(FormData: CourseSchemaType): Promise<ApiResponse> {
    try {

        // get the userId from the session or context
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session || !session.user?.id) {
            return {
                status: "error",
                message: "User must be authenticated to create a course",
            };
        }

        // Validate the form data using Zod schema
        // This will ensure that the data conforms to the expected structure
        const validation = CourseSchema.safeParse(FormData);
        if (!validation.success) {
            return {
                status: "error",
                message: validation.error.message
            };
        }

        const courseData = await prisma.course.create({
            data: {
                ...validation.data,
                authorId: session?.user.id, 
            }
        })

        return {
            status: "success",
            message: "Course created successfully"
        }
    } catch (error) {
        return {
            status: "error",
            message: "Failed to create course"
        };
    }
}