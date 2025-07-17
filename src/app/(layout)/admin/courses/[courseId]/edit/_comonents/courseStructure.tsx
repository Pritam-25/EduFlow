"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DndContext,
  rectIntersection,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DraggableSyntheticListeners,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ReactNode, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AdminGetCourseType } from "@/app/(layout)/admin/actions/getCourse";
import { cn } from "@/lib/utils";
import { Collapsible } from "@/components/ui/collapsible";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  GripVertical,
  Target,
  Trash2,
} from "lucide-react";
import {
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { it } from "node:test";
import { toast } from "sonner";
import { reorderLessons } from "@/app/(layout)/admin/actions/editCourse";
import { error } from "console";
import { th } from "zod/v4/locales";

interface CourseStructureProps {
  data: AdminGetCourseType;
}

interface SortableItemProps {
  id: string;
  children: (listeners: DraggableSyntheticListeners) => ReactNode;
  className?: string;
  data?: {
    type: "chapter" | "lesson";
    chapterId?: string; /// only relevant for lessons
  };
}

export default function CourseStructure({ data }: CourseStructureProps) {
  console.log("CourseStructure data:", {
    dataExists: !!data,
    data: data,
    chaptersExists: !!data?.chapters,
    chaptersLength: data?.chapters?.length || 0,
  });

  // Add null check and provide a default empty array
  const initialChapters =
    data?.chapters?.map((chapter) => ({
      id: chapter.id,
      title: chapter.title,
      position: chapter.position,
      isOpen: true, // default chapter to open
      lessons:
        chapter.lessons?.map((lesson) => ({
          id: lesson.id,
          title: lesson.title,
          position: lesson.position,
          thumbnailkey: lesson.thumbnailkey,
          videokey: lesson.videokey,
          description: lesson.description,
        })) || [],
    })) || [];

  console.log("initialChapters:", initialChapters);

  const [items, setItems] = useState(initialChapters);

  function SortableItem({ children, id, className, data }: SortableItemProps) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: id, data: data });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        className={cn("touch-none", className, isDragging ? "z-10" : "z-0")}
      >
        {children(listeners)}
      </div>
    );
  }

  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }
    // Ensure active and over are defined
    const activeId = active.id;
    const overId = over?.id;
    const activeType = active.data.current?.type as "chapter" | "lesson";
    const overType = over?.data.current?.type as "chapter" | "lesson";
    const courseId = data.id;

    // chapter reordering logic
    if (activeType === "chapter") {
      let targetChapterId = null;

      if (overType === "chapter") {
        targetChapterId = overId;
      } else if (overType === "lesson") {
        targetChapterId = over.data.current?.chapterId ?? null;
      }
      if (!targetChapterId) {
        console.error("Could not determine target chapter for reordering");
        return;
      }

      const oldIndex = items.findIndex((chapter) => chapter.id === activeId);
      const newIndex = items.findIndex((chapter) => chapter.id === targetChapterId);

      if (oldIndex === -1 || newIndex === -1) {
        console.error("Invalid indices for reordering chapters");
        return;
      }

      const reorderedLocalChapters = arrayMove(items, oldIndex, newIndex);

      const updatedChaptersForStates = reorderedLocalChapters.map((chapter, index) => ({
        ...chapter,
        position: index + 1, // Update position based on new order
      }));

      const previousChapters = [...items];

      setItems(updatedChaptersForStates);
    }

    // lesson reordering logic
    if (activeType === "lesson" && overType === "lesson") {
      const activeChapterId = active.data.current?.chapterId;
      const overChapterId = over.data.current?.chapterId;

      if (!activeChapterId || activeChapterId !== overChapterId) {
        toast.error("Cannot reorder lessons across different chapters");
        return;
      }

      const chapterIndex = items.findIndex((chapter) => chapter.id === activeChapterId);
      if (chapterIndex === -1) {
        console.error("Invalid chapter index for reordering lessons");
        return;
      }

      const chapterToUpdate = items[chapterIndex];
      const lessonItems = chapterToUpdate.lessons;

      const oldIndex = lessonItems.findIndex((lesson) => lesson.id === active.id);
      const newIndex = lessonItems.findIndex((lesson) => lesson.id === over.id);

      if (oldIndex === -1 || newIndex === -1) {
        console.error("Invalid indices for reordering lessons");
        return;
      }

      const reorderedLocalLessons = arrayMove(lessonItems, oldIndex, newIndex);

      const updatedLessonsForStates = reorderedLocalLessons.map((lesson, index) => ({
        ...lesson,
        position: index + 1, // Update position based on new order
      }));


      const newItems = [...items];
      newItems[chapterIndex] = {
        ...chapterToUpdate,
        lessons: updatedLessonsForStates,
      };
      const previousItems = [...items];

      setItems(newItems);

      if (courseId) {
        const lessonToUpdate = updatedLessonsForStates.map((lesson, index) => ({
          id: lesson.id,
          position: lesson.position,
          chapterId: chapterToUpdate.id,
        }));

        // Call API to update lessons
        const reorderLessonsPromise = () => reorderLessons(
          courseId,
          chapterToUpdate.id,
          lessonToUpdate
        );

        toast.promise(reorderLessonsPromise(), {
          loading: "Reordering lessons...",
          success: (result) => {
            if(result.status === "success") {
              return result.message;
            }
            throw new Error(result.message);
          },
          error: () => {
            setItems(previousItems);
            return "Failed to reorder lessons";
          }
        });
      }

      return; // Exit early after handling lesson reordering
    }
  }

  const handleChapterToggle = (chapterId: string) => {
    setItems((prevItems) =>
      prevItems.map((chapter) =>
        chapter.id === chapterId
          ? { ...chapter, isOpen: !chapter.isOpen }
          : chapter
      )
    );
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <DndContext collisionDetection={rectIntersection} onDragEnd={handleDragEnd}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b border-border">
          <CardTitle>Chapters</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            {items.map((item) => (
              <SortableItem
                key={item.id}
                id={item.id}
                data={{ type: "chapter" }}
              >
                {(listeners) => (
                  <Card>
                    <Collapsible
                      open={item.isOpen}
                      onOpenChange={() => handleChapterToggle(item.id)}
                    >
                      <div className="flex items-center justify-between p-4 border-b border-border">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" {...listeners}>
                            <GripVertical className="size-4" />
                          </Button>
                          <CollapsibleTrigger asChild>
                            <Button
                              size="icon"
                              className="flex items-center gap-2"
                              variant="ghost"
                            >
                              {item.isOpen ? (
                                <ChevronDown className="size-4" />
                              ) : (
                                <ChevronRight className="size-4" />
                              )}
                            </Button>
                          </CollapsibleTrigger>
                          <p className="cursor-pointer hover:text-primary pl-2">
                            {item.title}
                          </p>
                        </div>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="size-4" />
                        </Button>
                      </div>

                      <CollapsibleContent>
                        <div className="p-4 pl-14">
                          {" "}
                          {/* Added padding-left to align with chapter title */}
                          <SortableContext
                            items={item.lessons.map((lesson) => lesson.id)}
                            strategy={verticalListSortingStrategy}
                          >
                            {item.lessons.map((lesson) => (
                              <SortableItem
                                key={lesson.id}
                                id={lesson.id}
                                data={{ type: "lesson", chapterId: item.id }}
                              >
                                {(listeners) => (
                                  <div className="flex items-center justify-between p-2 hover:bg-secondary rounded-md mb-1">
                                    <div className="flex items-center gap-2">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        {...listeners}
                                      >
                                        <GripVertical className="size-4" />
                                      </Button>
                                      <FileText className="size-4 " />
                                      <Link
                                        href={`/admin/courses/${data.id}/${item.id}/${lesson.id}`}
                                        className="cursor-pointer hover:text-primary pl-2"
                                      >
                                        {lesson.title}
                                      </Link>
                                    </div>
                                    <Button variant="ghost" size="icon">
                                      <Trash2 className="size-4" />
                                    </Button>
                                  </div>
                                )}
                              </SortableItem>
                            ))}
                          </SortableContext>
                          {/* create new lesson button */}
                          <div className="w-full mt-4">
                            {" "}
                            {/* Added margin-top for spacing */}
                            <Button variant="outline" className="w-full">
                              Create New Lesson
                            </Button>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                )}
              </SortableItem>
            ))}
          </SortableContext>
        </CardContent>
      </Card>
    </DndContext>
  );
}
