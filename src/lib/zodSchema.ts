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

export const uploadSchema = z.object({
  fileName: z.string().min(1, "File name is required"),
  size: z.number().max(5 * 1024 * 1024, "File size must be less than 5MB"),
  contentType: z.string().min(1, "Content type is required"),
  isImage: z.boolean().optional(),
});

export const SignUpSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  email: z.string()
    .email("Please enter a valid email address")
    .toLowerCase(),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password must be less than 20 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one lowercase letter, one uppercase letter, and one number"),
});

export const LoginSchema = z.object({
  email: z.string()
    .email("Please enter a valid email address")
    .toLowerCase(),
  password: z.string()
    .min(1, "Password is required"),
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;
export type CourseSchemaType = z.infer<typeof CourseSchema>;
export type ChapterSchemaType = z.infer<typeof ChapterSchema>;
export type LessonSchemaType = z.infer<typeof LessonSchema>;
export type UploadSchemaType = z.infer<typeof uploadSchema>;
export type SignUpSchemaType = z.infer<typeof SignUpSchema>;