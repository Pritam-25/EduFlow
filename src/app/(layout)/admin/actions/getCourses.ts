import { prisma } from "@/lib/db";



export async function adminGetCourses(params: { userId: string }) {
    // Implementation here
    const courses = await prisma.course.findMany({
        orderBy: {
            createdAt: "desc"  // newest first
        },
        select:{
            id: true,
            smallDescription: true,
            duration: true,
            slug: true,
            level: true,
            fileKey: true,
            title: true,
            createdAt: true,
        }
    });
    return courses;
}

export type AdminCourseType = Awaited<ReturnType<typeof adminGetCourses>>[0];