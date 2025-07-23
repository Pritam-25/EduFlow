"use server"

import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { CourseSchema, CourseSchemaType } from "@/lib/zodSchema";
import { revalidatePath } from "next/cache";



export async function adminEditCourse(course: CourseSchemaType, courseId: string): Promise<ApiResponse> {

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


export async function reorderLessons(
    courseId: string,
    chapterId: string,
    lessons: { id: string; position: number}[]
): Promise<ApiResponse> {
    try {

        if (!courseId) {
            return {
                status: "error",
                message: "Course ID is required for reordering.",
            };
        }

        if (!chapterId) {
            return {
                status: "error",
                message: "Chapter ID is required for reordering lessons.",
            };
        }

        if (!lessons || lessons.length === 0) {
            return {
                status: "error",
                message: "No lessons provided for reordering.",
            };
        }

        // Update lessons
        const lessonUpdates = lessons.map((lesson) =>
            prisma.lesson.update({
                where: { id: lesson.id, chapterId: chapterId },
                data: { position: lesson.position },
            })
        );

        await prisma.$transaction(lessonUpdates);

        // revalidate the course structure to update the UI after database changes
        // This will ensure that the latest order is reflected in the UI
        revalidatePath(`/admin/courses/${courseId}/edit`);

        return {
            status: "success",
            message: "Lessons reordered successfully",
        };
    } catch (error) {
        console.error("Error reordering lessons:", error);
        return {
            status: "error",
            message: "Failed to reorder lessons",
        };
    }
}


export async function reorderChapters(
    courseId: string,
    chapters: { id: string; position: number }[]
): Promise<ApiResponse> {
    try {
        if (!courseId) {
            return {
                status: "error",
                message: "Course ID is required for reordering.",
            };
        }

        if (!chapters || chapters.length === 0) {
            return {
                status: "error",
                message: "No chapters provided for reordering.",
            };
        }

        // Update chapters
        const chapterUpdates = chapters.map((chapter) =>
            prisma.chapter.update({
                where: { id: chapter.id, courseId: courseId },
                data: { position: chapter.position },
            })
        );

        await prisma.$transaction(chapterUpdates);

        // revalidate the course structure to update the UI after database changes
        revalidatePath(`/admin/courses/${courseId}/edit`);

        return {
            status: "success",
            message: "Chapters reordered successfully",
        };
    } catch (error) {
        console.error("Error reordering chapters:", error);
        return {
            status: "error",
            message: "Failed to reorder chapters",
        };
    }
}