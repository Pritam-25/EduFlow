"use server"

import { ajProtect } from "@/lib/arcjet-protect";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/require_user";
import { ApiResponse } from "@/lib/types";
import { CourseSchema, CourseSchemaType } from "@/lib/zodSchema"
import { request } from "@arcjet/next";



export async function adminCreateCourse(FormData: CourseSchemaType): Promise<ApiResponse> {

    const session = await requireUser();
    try {
        const req = await request();
        const decision = await ajProtect.protect(req, {
            fingerprint: session?.user?.id || "anonymous",
        });

        if (!session || !session.user?.id) {
            return {
                status: "error",
                message: "User must be authenticated to create a course",
            };
        }

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                return {
                    status: "error",
                    message: "You have blocked due to rate limiting. Please try again later.",
                };
            }
            else {
                return {
                    status: "error",
                    message: "Too many requests, please try again later.(Your are a bot!)",
                };
            }
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

        await prisma.course.create({
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
        console.error("Error creating course:", error);
        return {
            status: "error",
            message: "Failed to create course"
        };
    }
}