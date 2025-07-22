import * as z from "zod";
import { Category, CourseLevel, CourseStates } from "@/generated/prisma";

export const CourseSchema = z.object({
  title: z.string().min(3, "Title is required").max(100),
  description: z.string().min(10, "Description is required").max(5000),
  fileKey: z.string().min(1, "File key is required"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  duration: z.coerce.number().min(1, "Duration is required").max(500, "Duration must be less than 500 hours"),
  level: z.nativeEnum(CourseLevel),
  category: z
    .array(z.nativeEnum(Category))
    .min(1, "At least one category must be selected"),
  smallDescription: z.string().min(10, "Small description is required").max(200),
  slug: z.string().min(1, "Slug is required").max(100),
  states: z.nativeEnum(CourseStates),
  authorId: z.string().optional(),
});

export const ChapterSchema = z.object({
  title: z.string().min(3, "Title is required").max(100),
  courseId: z.string().min(1, "Invalid course ID"),
});

export const LessonSchema = z.object({
  title: z.string().min(3, "Title is required").max(100),
  description: z.string().min(10, "Description is required").max(2000).optional(),
  thumbnailKey: z.string().min(1, "Thumbnail key is required").optional(),
  videoKey: z.string().min(1, "Video key is required").optional(),
  courseId: z.string().min(1, "Invalid course ID"),
  chapterId: z.string().min(1, "Invalid chapter ID"),
});

export type CourseSchemaType = z.infer<typeof CourseSchema>;
export type ChapterSchemaType = z.infer<typeof ChapterSchema>;
export type LessonSchemaType = z.infer<typeof LessonSchema>;