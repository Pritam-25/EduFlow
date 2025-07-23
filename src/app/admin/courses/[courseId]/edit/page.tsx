
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import adminGetCourse from "../../../actions/getCourse";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import EditCourseForm from "./_components/editCourseForm";
import CourseStructure from "@/app/admin/courses/[courseId]/edit/_components/courseStructure";

// get the courseId from the URL parameters
type Params = Promise<{ courseId: string }>;


export default async function Page({ params }: { params: Params }) {
  const { courseId } = await params;
  const course = await adminGetCourse(courseId);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        Edit Course:
        <span className="text-primary"> {course.title}</span>
      </h1>

      <Tabs defaultValue="basic-info" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
          <TabsTrigger value="course-structure">Course Structure</TabsTrigger>
        </TabsList>
        <TabsContent value="basic-info">

          <Card>
            <CardHeader>
              <CardTitle>Basic Info</CardTitle>
              <CardDescription>
                Provide basic information about the course
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <EditCourseForm course={course} />
            </CardContent>
          </Card>

        </TabsContent>
        <TabsContent value="course-structure">
          <Card>
            <CardHeader>
              <CardTitle>Course Structure</CardTitle>
              <CardDescription>
                Provide information about the course structure
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <CourseStructure data={course} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}