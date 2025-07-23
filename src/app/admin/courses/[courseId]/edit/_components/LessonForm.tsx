"use client";

import { LessonType } from "@/app/admin/actions/getLesson";
import { updateLesson } from "@/app/admin/actions/updateLesson";
import { FileUploader } from "@/components/file-uploader/uploader";
import Tiptap from "@/components/rich-text-editor/editor";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { tryCatch } from "@/hooks/try-catch";
import { LessonSchemaType, LessonSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface LessonFormProps {
  lesson: LessonType
  courseId: string;
  chapterId: string;
}

export default function LessonForm({ lesson, courseId, chapterId }: LessonFormProps) {
  const [pending, startTransition] = useTransition()
  const router = useRouter();

  //* 1. Define your form.
  const form = useForm<LessonSchemaType>({
    resolver: zodResolver(LessonSchema),
    defaultValues: {
      title: lesson.title,
      courseId: courseId,
      chapterId: chapterId,
      description: lesson.description ?? undefined,
      videoKey: lesson.videokey ?? undefined,
      thumbnailKey: lesson.thumbnailkey ?? undefined,
    },
  });

  //* 2. Handle form submission.
  const onSubmit = async (values: LessonSchemaType) => {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(updateLesson(values, lesson.id));

      if (error) {
        console.log("Error updating lesson:", error);
        toast.error("An error occurred. Please try again.");
        return;
      }

      if (result.status === "error") {
        toast.error(result.message);
        return;
      }
      if (result.status === "success") {
        toast.success(result.message);
        form.reset();
        router.push(`/admin/courses/${courseId}/edit`);
      }
    });
  }

  return (
    <div>
      <Link href={`/admin/courses/${courseId}/edit`} className={buttonVariants({ variant: "outline", className: "mb-6" })}>
        <ArrowLeft className="size-4" />
        <span>Go Back</span>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Lesson Configuration</CardTitle>
          <CardDescription>Configure the video and description for this lesson.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lesson Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Lesson xyz" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />


              {/* description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Tiptap field={{ ...field, value: field.value ?? "" }} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Thumbnail Image */}
              <FormField
                control={form.control}
                name="thumbnailKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thumbnail Image</FormLabel>
                    <FormControl>
                      <FileUploader onChange={field.onChange} value={field.value} fileTypeAccepted="image" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />


              {/* Video */}
              <FormField
                control={form.control}
                name="videoKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lesson Video</FormLabel>
                    <FormControl>
                      <FileUploader onChange={field.onChange} value={field.value} fileTypeAccepted="video" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button type="submit" disabled={pending}>
                {pending ? <>
                  <Loader2 className="animate-spin" />
                  Saving...
                </> : "Save Lesson"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}