"use server";
import { CourseStates } from "@/generated/prisma";
import { prisma } from "@/lib/db";

export async function getAllCourses(){
  const courses = await prisma.course.findMany({
    where:{
      states: CourseStates.PUBLISHED,
    },
    orderBy:{
      createdAt: 'desc'
    },
    select:{
      id: true,
      title: true,
      smallDescription: true,
      slug: true,
      fileKey: true,
      level: true,
      duration: true,
      category: true,
      price: true,
      createdAt: true,
      updatedAt: true,
    }
  })

  return courses;
}

export type publicCoursesType = Awaited<ReturnType<typeof getAllCourses>>[0];