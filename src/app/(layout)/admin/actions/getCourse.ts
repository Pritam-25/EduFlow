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
        }
    });

    if (!course) {
        return notFound()
    }

    return course;
}

export type AdminGetCourseType = Awaited<ReturnType<typeof adminGetCourse>>;