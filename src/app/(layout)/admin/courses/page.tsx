import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { IconCirclePlusFilled, type Icon } from "@tabler/icons-react";
import { adminGetCourses } from "../actions/getCourses";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import AdminCourseCard, { AdminCourseCardSkeleton } from "./_components/adminCourseCard";
import EmptyCoursePage from "@/components/general/emptyStateCourse";
import { Suspense } from "react";

export default function CoursesPage() {
  
  return (
    <div >
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Your Courses</h1>
        <Link className={buttonVariants()} href="courses/create">
          <IconCirclePlusFilled />
          <span >Create Course</span>
        </Link>
      </div>

      <Suspense fallback={<AdminCourseCardSkeletonLayout />}>
        <RenderCourses />
      </Suspense>
    </div>
  );
}


async function RenderCourses() {
  const courses = await adminGetCourses();

  return (
    <>
      {courses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
          {courses.map((course) => (
            <AdminCourseCard key={course.id} course={course} />
          ))}
          </div>
        ) : (
          <EmptyCoursePage />
        )}
    </>
  )
}

function AdminCourseCardSkeletonLayout() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <AdminCourseCardSkeleton key={index} />
      ))}
    </div>
  )
}