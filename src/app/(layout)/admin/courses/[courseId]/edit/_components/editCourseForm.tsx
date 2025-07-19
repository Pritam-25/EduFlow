"use client";

import { ArrowLeft, Loader2, SparkleIcon } from "lucide-react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CourseSchema, CourseSchemaType } from "@/lib/zodSchema";
import { Category, CourseLevel, CourseStates, Role } from "@/generated/prisma";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import slugify from "slugify";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    MultiSelector,
    MultiSelectorContent,
    MultiSelectorInput,
    MultiSelectorItem,
    MultiSelectorList,
    MultiSelectorTrigger,
} from "@/components/general/multi-select";
import Tiptap from "@/components/rich-text-editor/editor";
import { FileUploader } from "@/components/file-uploader/uploader";
import { useTransition } from "react";
import { tryCatch } from "@/hooks/try-catch";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { IconCirclePlusFilled } from "@tabler/icons-react";
import { adminCreateCourse } from "@/app/(layout)/admin/actions/createCourse";
import { adminEditCourse } from "@/app/(layout)/admin/actions/editCourse";
import { AdminGetCourseType } from "@/app/(layout)/admin/actions/getCourse";


interface EditCourseFormProps {
    course: AdminGetCourseType;
}

export default function EditCourseForm({ course }: EditCourseFormProps) {

    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const form = useForm<CourseSchemaType>({
        resolver: zodResolver(CourseSchema),
        defaultValues: {
            title: course.title || "",
            description: course.description || "",
            fileKey: course.fileKey || "",
            price: course.price || 0,
            duration: course.duration || 0,
            level: course.level || CourseLevel.BEGINNER,
            category: [Category.OTHER],
            smallDescription: course.smallDescription || "",
            slug: course.slug || "",
            states: course.states || CourseStates.DRAFT,
        },
    });

    // 2. Define a submit handler.
    async function onSubmit(values: CourseSchemaType) {
        console.log("🎯 Submit handler called with:", values); // check if called
        // Do something with the form values.
        startTransition(async () => {
            const { data: result, error } = await tryCatch(adminEditCourse(values, course.id));

            if (error) {
                toast.error("An unexpected error occurred. Please try again.");
                console.error("Error creating course:", error);
                return;
            }

            if (result.status === "error") {
                toast.error(result.message);
                return;
            }

            if (result.status === "success") {
                toast.success(result.message);
                form.reset();
                // Redirect to the courses page after successful creation
                router.push("/admin/courses");
                return;
            }
        });

        console.log(values);
    }


    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Title" {...field} />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex flex-col md:flex-row gap-4 md:items-end">
                        <FormField
                            control={form.control}
                            name="slug"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>Slug</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Slug" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex items-end">
                            <Button
                                type="button"
                                className="whitespace-nowrap w-full md:w-auto"
                                onClick={() => {
                                    const slug = slugify(form.getValues("title"), {
                                        lower: true,
                                        strict: true,
                                    });
                                    form.setValue("slug", slug);
                                }}
                            >
                                Generate Slug
                                <SparkleIcon className="ml-2 size-4" />
                            </Button>
                        </div>
                    </div>

                    {/* small description */}
                    <FormField
                        control={form.control}
                        name="smallDescription"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Small Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Small Description"
                                        className="min-h-[120px]"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* big description */}
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    {/* <Textarea
                        placeholder="Description"
                        className="min-h-[120px]"
                        {...field}
                      /> */}
                                    <Tiptap field={field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Thumbnail */}
                    <FormField
                        control={form.control}
                        name="fileKey"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Thumbnail image</FormLabel>
                                <FormControl>
                                    <FileUploader onChange={field.onChange} value={field.value} fileTypeAccepted="image" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Category and Level Selection */}
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <FormControl>
                                    <MultiSelector
                                        onValuesChange={field.onChange}
                                        values={field.value ?? []}
                                    >
                                        <MultiSelectorTrigger>
                                            <MultiSelectorInput placeholder="Select categories..." />
                                        </MultiSelectorTrigger>
                                        <MultiSelectorContent>
                                            <MultiSelectorList>
                                                {Object.values(Category).map((cat) => (
                                                    <MultiSelectorItem key={cat} value={cat}>
                                                        <span>{cat.replace(/_/g, " ")}</span>
                                                    </MultiSelectorItem>
                                                ))}
                                            </MultiSelectorList>
                                        </MultiSelectorContent>
                                    </MultiSelector>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="level"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Level</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select level" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.values(CourseLevel).map((level) => (
                                                <SelectItem key={level} value={level}>
                                                    {level}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="states"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>States</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select level" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.values(CourseStates).map((state) => (
                                                <SelectItem key={state} value={state}>
                                                    {state.replace(/_/g, " ")}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price ($)</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="0" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="duration"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Duration (hours)</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="0" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={isPending}
                        aria-disabled={isPending}
                    >
                        {isPending ? (
                            <>
                                Updating...
                                <Loader2 className="animate-spin ml-2" />
                            </>
                        ) : (
                            <>
                                Update Course <IconCirclePlusFilled className="inline-block ml-2" />
                            </>
                        )}
                    </Button>
                </form>
            </Form>
        </>
    );
}