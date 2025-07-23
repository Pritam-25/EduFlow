import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export async function getIndividualCourse(slug: string) {
  const course = await prisma.course.findUnique({
    where: { slug }
    , select: {
      id: true,
      title: true,
      description: true,
      fileKey: true,
      level: true,
      duration: true,
      category: true,
      price: true,
      chapters: {
        select: {
          id: true,
          title: true,
          lessons: {
            select: {
              id: true,
              title: true,
            },
            orderBy: {
              position: 'asc',
            }
          },

        },
        orderBy: {
          position: 'asc',
        }
      },
      createdAt: true,
      updatedAt: true,
    }
  });

  if (!course) {
    return notFound();
  }

  return course;
}