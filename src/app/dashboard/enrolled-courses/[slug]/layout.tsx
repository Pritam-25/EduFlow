import { ReactNode } from "react";
import { CourseSidebar } from "../../_components/courseSidebar";
import { getCourseSidebarData } from "../../actions/get-course-sidebar-data";
import LessonItemPage from "./[lessonId]/page";

interface courseSidebarLayoutProps {
  params: Promise<{ slug: string }>
  children: ReactNode
}

export default async function CoursePlayLayout({ children, params }: courseSidebarLayoutProps) {

  const { slug } = await params;

  // server side security check and lightweight data fetching
  const course = await getCourseSidebarData(slug);

  return (
    <div className="flex flex-1">
      {/* sidebar - 30% */}
      <div className="w-100  h-full border-r border-border shrink-0">
        <CourseSidebar course={course.course} />
      </div>

      {/* Course Player - 70% */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  )
}