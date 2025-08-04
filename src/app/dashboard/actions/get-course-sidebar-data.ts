import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/require_user"
import { notFound } from "next/navigation";
import "server-only"

export async function getCourseSidebarData(slug: string) {

  const session = await requireUser();


  const course = await prisma.course.findUnique({
    where: {
      slug: slug
    },
    select: {
      id: true,
      title: true,
      slug: true,
      fileKey: true,
      level: true,
      duration: true,
      category: true,
      smallDescription: true,
      chapters: {
        orderBy: {
          position: "asc"
        },
        select: {
          id: true,
          title: true,
          position: true,
          lessons: {
            orderBy: {
              position: "asc"
            },
            select: {
              id: true,
              title: true,
              position: true,
              description: true,
            }
          }
        }
      }
    }
  })


  if (!course) {
    return notFound()
  }

  const isEnrolled = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.user.id,
        courseId: course.id
      }
    }
  });


  if (!isEnrolled || isEnrolled.status !== "ACTIVE") {
    return notFound();
  }

  return { course }
}


export type CourseSidebarDataType = Awaited<ReturnType<typeof getCourseSidebarData>>;