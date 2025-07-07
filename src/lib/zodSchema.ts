import * as z from "zod/v4";
import { CourseLevel, CourseStates, category } from "@/generated/prisma";

export const CourseSchema = z.object({
  title: z.string().min(3, "Title is required").max(100),
  description: z.string().min(10, "Description is required").max(2000),
  fileKey: z.string().min(1, "File key is required"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  duration: z.coerce.number().min(1, "Duration is required").max(500, "Duration must be less than 500 hours"),
  level: z.enum([...Object.values(CourseLevel)] as [string, ...string[]]).default(CourseLevel.BEGINNER),
  category: z.enum([...Object.values(category)] as [string, ...string[]]).default(category.OTHER),
  smallDescription: z.string().min(10, "Small description is required").max(200),
  slug: z.string().min(1, "Slug is required").max(100),
  states: z.enum([...Object.values(CourseStates)] as [string, ...string[]]).default(CourseStates.DRAFT),
  authorId: z.string().min(1, "Author ID is required"), // Include this only if coming from frontend
});
