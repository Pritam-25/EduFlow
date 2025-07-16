import "server-only"

import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export default async function adminGetCourse(id: string) {
    // Instead of returning JSX, return course data or handle logic here
    // If you want to use JSX, this should be a React component, not an async function
    const course = await prisma.course.findUnique({
        where: { id: id },
        select: {
            id: true,
            title: true,
            smallDescription: true,
            description: true,
            slug: true,
            level: true,
            duration: true,
            fileKey: true,
            category: true,
            price: true,
            states: true,
            chapters: {
                select: {
                    id: true,
                    title: true,
                    position: true,
                    lessons: {
                        select: {
                            id: true,
                            title: true,
                            position: true,
                            thumbnailkey: true,
                            videokey: true,
                            description: true,
                        }
                    }
                }
            }
        }
    });

    if (!course) {
        return notFound()
    }

        // ✅ Debug log — see full structure of fetched course
    console.log("🔍 [adminGetCourse] Course fetched:\n", JSON.stringify(course, null, 2));

    return course;
}

export type AdminGetCourseType = Awaited<ReturnType<typeof adminGetCourse>>;