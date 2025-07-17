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
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { ReactNode, useState } from "react";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AdminGetCourseType } from "@/app/(layout)/admin/actions/getCourse";
import { cn } from "@/lib/utils";
import { Collapsible } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, FileText, GripVertical, Trash2 } from "lucide-react";
import { CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible";
import { Button } from "@/components/ui/button";
import Link from "next/link";


interface CourseStructureProps { data: AdminGetCourseType }

interface SortableItemProps {
    id: string;
    children: (listeners: DraggableSyntheticListeners) => ReactNode;
    className?: string;
    data?: {
        type: 'chapter' | 'lesson';
        chapterId?: string; /// only relevant for lessons
    }
}

export default function CourseStructure({ data }: CourseStructureProps) {
    console.log("CourseStructure data:", {
        dataExists: !!data,
        data: data,
        chaptersExists: !!data?.chapters,
        chaptersLength: data?.chapters?.length || 0
    });

    // Add null check and provide a default empty array
    const initialChapters = data?.chapters?.map((chapter) => (
        {
            id: chapter.id,
            title: chapter.title,
            position: chapter.position,
            isOpen: true, // default chapter to open
            lessons: chapter.lessons?.map((lesson) => ({
                id: lesson.id,
                title: lesson.title,
                position: lesson.position,
                thumbnailkey: lesson.thumbnailkey,
                videokey: lesson.videokey,
                description: lesson.description
            })) || []
        }
    )) || [];

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
            <div ref={setNodeRef} style={style} {...attributes} className={cn("touch-none", className, isDragging ? "z-10" : "z-0")}>
                {children(listeners)}
            </div>
        );

    }

    function handleDragEnd(event: any) {
        const { active, over } = event;

        if (active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.indexOf(active.id);
                const newIndex = items.indexOf(over.id);

                return arrayMove(items, oldIndex, newIndex);
            });
        }
    }

    const handleChapterToggle = (chapterId: string) => {
        setItems((prevItems) =>
            prevItems.map((chapter) =>
                chapter.id === chapterId ? { ...chapter, isOpen: !chapter.isOpen } : chapter
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
        <DndContext
            collisionDetection={rectIntersection}
            onDragEnd={handleDragEnd}
        >
            <Card>
                <CardHeader
                    className="flex flex-row items-center justify-between border-b border-border">
                    <CardTitle>
                        Chapters
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <SortableContext
                        items={items}
                        strategy={verticalListSortingStrategy}
                    >
                        {items.map((item) => (
                            <SortableItem
                                key={item.id}
                                id={item.id}
                                data={{ type: 'chapter' }}
                            >
                                {listeners => (
                                    <Card>
                                        <Collapsible open={item.isOpen} onOpenChange={() => handleChapterToggle(item.id)}>
                                            <div className="flex items-center justify-between p-4 border-b border-border">
                                                <div className="flex items-center gap-2">
                                                    <Button variant="ghost" size="icon" {...listeners}>
                                                        <GripVertical className="size-4" />
                                                    </Button>
                                                    <CollapsibleTrigger asChild>
                                                        <Button size="icon" className=" flex items-center gap-2" variant="ghost">
                                                            {item.isOpen ? (
                                                                <ChevronDown className="size-4" />
                                                            ) : (
                                                                <ChevronRight className="size-4" />
                                                            )}
                                                        </Button>
                                                    </CollapsibleTrigger>

                                                    <p className="cursor-pointer hover:text-primary pl-2">{item.title}</p>
                                                    <Button variant="ghost" size="icon">
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                </div>

                                                <CollapsibleContent>
                                                    <div className="p-1">
                                                        <SortableContext
                                                            items={item.lessons.map((lesson) => lesson.id)}
                                                            strategy={verticalListSortingStrategy}
                                                        >
                                                            {item.lessons.map((lesson) => (
                                                                <SortableItem
                                                                    key={lesson.id}
                                                                    id={lesson.id}
                                                                    data={{ type: 'lesson', chapterId: item.id }}
                                                                    className="p-2 border-b border-border"
                                                                >
                                                                    {listeners => (
                                                                        <div className="flex items-center justify-between p-2 hover:bg-accent rounded-md">
                                                                            <div className="flex items-center gap-2">
                                                                                <Button variant="ghost" size="icon" {...listeners}>
                                                                                    <GripVertical className="size-4" />
                                                                                </Button>
                                                                                <FileText className="size-4" />
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
                                                    </div>
                                                </CollapsibleContent>
                                            </div>
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