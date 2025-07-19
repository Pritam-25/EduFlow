import { getLesson } from "@/app/(layout)/admin/actions/getLesson";
import LessonForm from "../../edit/_comonents/LessonForm";

type Params = Promise<{courseId: string; chapterId: string; lessonId: string}>;

export default async function LessonIdPage({params}: {params: Params}) {

  const { courseId, chapterId, lessonId } = await params;
  const lesson = await getLesson(lessonId)
  return (
    <div>
      <LessonForm
        lesson={lesson}
        courseId={courseId}
        chapterId={chapterId}
      />
    </div>
  );
}