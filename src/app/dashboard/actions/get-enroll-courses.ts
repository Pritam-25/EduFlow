import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/require_user";
import "server-only"

export async function getEnrollCourses() {
  const user = await requireUser();

  const enrollments = await prisma.enrollment.findMany({
    where: {
      userId: user.user.id,
      status: "ACTIVE",
    },
    select: {
      id: true,
      status: true,
      course: {
        select: {
          id: true,
          title: true,
          level: true,
          smallDescription: true,
          fileKey: true,
          slug: true,
          price: true,
          duration: true,
          chapters: {
            select: {
              id: true,
              lessons: {
                select: {
                  id: true,
                }
              }
            }
          }
        }
      }
    }
  });

  if (!enrollments || enrollments.length === 0) {
    return [];
  }

   // Flatten the data structure
  return enrollments.map(enrollment => ({
    ...enrollment.course, // Spread course data to top level
    enrollmentId: enrollment.id,
    enrollmentStatus: enrollment.status,
  }));
}

export type enrolledCourseType = Awaited<ReturnType<typeof getEnrollCourses>>[0];
