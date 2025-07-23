"use server"

import { prisma } from "@/lib/db"

export async function getCourseMeta(courseId: string) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: {
      title: true,
      chapters: {
        select: {
          lessons: { select: { id: true } },
        },
      },
    },
  })

  if (!course) throw new Error("Course not found")

  const chapterCount = course.chapters.length
  const lessonCount = course.chapters.reduce((total, chapter) => total + chapter.lessons.length, 0)

  return {
    name: course.title,
    chapterCount,
    lessonCount,
  }
}
