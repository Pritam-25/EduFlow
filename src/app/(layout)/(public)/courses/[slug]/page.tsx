import { getIndividualCourse } from "../../actions/get-single-course";
import Image from "next/image";
import { IconChartBar, IconChevronDown, IconClock, IconPlayerPlay } from "@tabler/icons-react";
import { RenderDescription } from "@/components/rich-text-editor/renderDescription";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, CheckIcon, SwatchBook } from "lucide-react";
import { env } from "@/env";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";


type Params = Promise<{ slug: string }>;

export default async function SlugPage({ params }: { params: Params }) {
  const { slug } = await params;
  const course = await getIndividualCourse(slug);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
      {/* Left Side: Video + Info */}
      <div className="order-1 lg:col-span-2 space-y-6">
        {/* Thumbnail */}
        <div className="relative aspect-video w-full overflow-hidden rounded-t-xl shadow-lg">
          <Image
            src={`https://${env.NEXT_PUBLIC_S3_BUCKET_NAME}.fly.storage.tigris.dev/${course.fileKey}`}
            alt={course.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent hover:bg-transparent" />
          {/* Course Level + Duration */}

        </div>

        {/* Course Title + Meta */}
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            {course.title}
          </h1>

          {/* Category Badge */}
          {
            course.category.map((cat) => (
              <Badge
                variant="outline"
                key={cat}
                className="mr-2 rounded-md border-blue-800 bg-blue-100 text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-100"
              >
                {cat}
              </Badge>

            ))
          }


          {/* Course Description */}
          <Separator className="my-8" />
          <div className="space-y-6 w-full">
            <h2 className="text-3xl font-semibold tracking-tight">About this Course</h2>
          </div>
          <Card className="px-6 bg-card/50 border-border/50">
            <RenderDescription json={JSON.parse(course.description)} />
          </Card>

          {/* Chapters Summary */}
          <div className="mt-12 space-x-6">
            <div className="flex items-center justify-between mb-4">

              <h2 className="text-3xl font-semibold tracking-tight">Course Content</h2>
              <div className="text-sm text-muted-foreground">
                {course.chapters.length} chapters |{" "}
                {course.chapters.reduce(
                  (acc, chapter) => acc + chapter.lessons.length,
                  0
                ) || 0}{" "}
                lessons
              </div>
            </div>
            <div className="space-y-4">
              {course.chapters.map((chapter, index) => (
                <Collapsible key={chapter.id} defaultOpen={index === 0} >
                  <Card className="border-2 p-0 overflow-hidden transition-all duration-200 hover:shadow-md gap-0">
                    <CollapsibleTrigger className="flex justify-between w-full py-2">
                      <CardContent className="p-6 w-full hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex item-center gap-4">
                            <p className="flex size-10 items-center justify-center right-full bg-primary/10 to-primary font-semibold rounded-full">
                              <span className="text-primary">
                                {index + 1}
                              </span>
                            </p>
                            <div>
                              <h3 className="text-xl text-left font-semibold">{chapter.title}</h3>
                              <p className="text-sm text-muted-foreground text-left">Chapter {index + 1}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <Badge className="text-sm" variant={"outline"}>
                              {chapter.lessons.length} lesson{chapter.lessons.length !== 1 && "s"}
                            </Badge>
                            <IconChevronDown className="size-5 text-muted-foreground" />
                          </div>
                        </div>
                      </CardContent>
                    </CollapsibleTrigger>
                    <CollapsibleContent >
                      <div className="border-top bg-muted/20">
                        <div className="p-6 pt-4 space-y-3">
                          {chapter.lessons.map((lesson, index) => (
                            <div key={lesson.id} className="flex item-center gap-4 rounded-lg p-3 hover:bg-accent transition-colors group">
                              <div className="flex size-8 items-center justify-center rounded-full bg-background border-2 border-primary/20">
                                <IconPlayerPlay className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-sm">
                                  {lesson.title}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">Lesson {index + 1}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              ))}
            </div>
          </div>
        </div>

      </div>
      {/* Right Side: Enrollment Card */}
      <div className="order-2 lg:col-span-1 space-y-6">
        <div className="sticky top-10">
          <Card >
            <CardContent>
              <div className=" flex items-center justify-between mb-6">
                <span className="text-lg font-medium">price:</span>
                <span className="text-2xl font-bold text-primary">{new Intl.NumberFormat('en-US', {
                  style: "currency",
                  currency: "USD",
                }).format(course.price)}
                </span>
              </div>

              <div className="mb-6 space-y-3 rounded-lg bg-muted p-4">
                <h4 className="font-medium">What you will get:</h4>
                <div className="flex flex-col gap-3">

                  {/* course duration */}
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <IconClock className="size-4" />
                    </div>
                    <div>
                      <p className="font-medium">Course Duration</p>
                      <p className="text-sm text-muted-foreground">{course.duration} hours
                      </p>
                    </div>
                  </div>

                  {/* difficulty level */}
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <IconChartBar className="size-4" />
                    </div>
                    <div>
                      <p className="font-medium">Difficulty Level</p>
                      <p className="text-sm text-muted-foreground">{course.level} </p>
                    </div>
                  </div>

                  {/* total chapters */}
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <SwatchBook className="size-4" />
                    </div>
                    <div>
                      <p className=" font-medium">Total Chapters</p>
                      <p className="text-sm text-muted-foreground"> {course.chapters.length} chapters</p>
                    </div>
                  </div>

                  {/* total lessons */}
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <BookOpen className="size-4" />
                    </div>
                    <div>
                      <p className="font-medium">Total Lessons</p>
                      <p className="text-sm text-muted-foreground">
                        {course.chapters.reduce(
                          (acc, chapter) => acc + chapter.lessons.length,
                          0
                        ) || 0}{" "}
                        lessons
                      </p>
                    </div>
                  </div>


                </div>
              </div>


              <div className="mb-6 space-y-3">
                <h4 className="font-semibold">This course includes:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <div className="rounded-full bg-green-500/10 p-1 text-green-500">
                      <CheckIcon className="size-3" />
                    </div>
                    <span>Full Lifetime access</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <div className="rounded-full bg-green-500/10 p-1 text-green-500">
                      <CheckIcon className="size-3" />
                    </div>
                    <span>Access on mobile and desktop</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <div className="rounded-full bg-green-500/10 p-1 text-green-500">
                      <CheckIcon className="size-3" />
                    </div>
                    <span>Certificate of completion</span>
                  </li>
                </ul>
              </div>
              <Button className="w-full">Enroll Now!</Button>
              <p className="mt-3 text-center text-xs text-muted-foreground"> 30-day money-back guarantee</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
