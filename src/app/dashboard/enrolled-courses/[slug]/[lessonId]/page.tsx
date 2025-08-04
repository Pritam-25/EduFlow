import CourseContent from "@/app/dashboard/_components/courseContent";
import { getLessonContent } from "@/app/dashboard/actions/get-lesson-content";

type Params = Promise<{ lessonId: string }>

export default async function LessonItemPage({ params }: { params: Params }) {

  const { lessonId } = await params;
  const lesson = await getLessonContent(lessonId);

  return (
    <CourseContent lesson={lesson} />
  );
}