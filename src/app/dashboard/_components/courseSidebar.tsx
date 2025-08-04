"use client";
import { ChevronDown, Play } from "lucide-react";
import { CourseSidebarDataType } from "../actions/get-course-sidebar-data";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible";
import { Button } from "@/components/ui/button";
import LessonItem from "./lessonItem";
import { usePathname } from "next/navigation";

interface courseSidebarProps {
  course: CourseSidebarDataType["course"]
}

export function CourseSidebar({ course }: courseSidebarProps) {

  const pathName = usePathname();
  const currentLessonId = pathName.split('/').pop() || '';

  return (
    <div className="flex flex-col h-full">
      <div className=" pb-4 pr-4 border-b border-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Play className="size-5 text-primary" />
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="font-semibold text-base leading-tight truncate">
              {course.title}
            </h1>
            <p className="text-xs text-muted-foreground mt-1 truncate">{course.smallDescription}</p>
          </div>
        </div>

        {/* lesson progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">
              Progress
            </span>
            <span className="font-medium">4/10 lesson</span>
          </div>

          <Progress value={55} className="h-1.5" />
          <p className="text-xs text-muted-foreground"> 55% complete</p>
        </div>
      </div>

      <div className="py-4 pr-4 space-y-3">
        {course.chapters.map((chapter, index) => (
          <Collapsible key={chapter.id} defaultOpen={index === 0}>
            <CollapsibleTrigger asChild>
              <Button variant={"outline"} className="w-full p-3 h-auto flex items-center gap-2">
                <div className="shrink-0">
                  <ChevronDown className="size-4 text-primary" />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="font-semibold text-sm truncate text-foreground">
                    {chapter.position}: {chapter.title}
                  </p>
                  <p className="text-[10px]">
                    {chapter.lessons.length} {chapter.lessons.length > 1 ? 'lessons' : 'lesson'}
                  </p>
                </div>
              </Button>
            </CollapsibleTrigger>

            <CollapsibleContent className="mt-3 pl-6 border-l-2 space-y-3">
              {chapter.lessons.map((lesson) => (
                <LessonItem key={lesson.id} lesson={lesson} slug={course.slug} isActive={lesson.id === currentLessonId} />
              ))}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  )
}