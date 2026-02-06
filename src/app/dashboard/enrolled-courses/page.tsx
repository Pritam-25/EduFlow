import { getEnrollCourses } from "../actions/get-enroll-courses";
import EmptyCoursePage from "@/components/general/emptyStateCourse";
import EnrollCourseCard, { EnrollCourseCardSkeleton } from "../_components/enroll_course_card";
import { Suspense } from "react";

export default async function EnrolledCoursesPage() {
  const enrolledCourses = await getEnrollCourses();

  return (
    <div >
      {enrolledCourses.length > 0 && (
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Enrolled Courses</h1>
        <p className="text-muted-foreground">Here you can see all the courses you are enrolled in</p>
      </div>
      )}

      <Suspense fallback={<AdminCourseCardSkeletonLayout />}>
        <RenderCourses courses={enrolledCourses} />
      </Suspense>
    </div>
  );
}


async function RenderCourses({courses}: {courses: any[]}) {

  return (
    <>
      {courses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
          {courses.map((course) => (
            <EnrollCourseCard key={course.id} course={course} />

          ))}
        </div>
      ) : (
        <EmptyCoursePage
          title="No Enrolled Courses"
          description="You haven't purchased any courses yet."
          buttonText="Browse Courses"
          href="/courses"
        />
      )}
    </>
  )
}

function AdminCourseCardSkeletonLayout() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <EnrollCourseCardSkeleton key={index} />
      ))}
    </div>
  );
}