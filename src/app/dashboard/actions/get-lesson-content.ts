import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/require_user";
import { notFound } from "next/navigation";

export async function getLessonContent(lessonId: string) {

  const session = await requireUser();

  if (!session) {
    throw new Error("User not authenticated");
  }

  const lesson = await prisma.lesson.findUnique({
    where: {
      id: lessonId
    },
    select: {
      id: true,
      title: true,
      description: true,
      thumbnailkey: true,
      videokey: true,
      position: true,
      chapter: {
        select: {
          courseId: true,
        }
      }
    }
  })

  if (!lesson) {
    return notFound();
  }

  if (!lesson.chapter.courseId) {
    throw new Error("Course ID not found");
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.user.id,
        courseId: lesson.chapter.courseId,
      },
    },
    select: {
      status: true,
    }
  })

  if (!enrollment || enrollment.status !== "ACTIVE") {
    return notFound();
  }

  return lesson;
}

export type LessonContentType = Awaited<ReturnType<typeof getLessonContent>>;