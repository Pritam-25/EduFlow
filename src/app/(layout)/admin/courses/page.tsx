import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { IconCirclePlusFilled, type Icon } from "@tabler/icons-react";
import { adminGetCourses } from "../actions/getCourses";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import AdminCourseCard from "./_components/adminCourseCard";

export default async function CoursesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const courses = await adminGetCourses({ userId: session?.user.id as string });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Courses</h1>
        <Link className={buttonVariants()} href="courses/create">
          <IconCirclePlusFilled />
          <span>Create Course</span>
        </Link>
      </div>

      <div>
        <h1>Here you will see all of your courses</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-6">
          {courses.map((course) => (
            <AdminCourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
}
