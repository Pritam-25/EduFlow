import { Card, CardContent } from "@/components/ui/card";
import { AdminCourseType } from "../../actions/getCourses";
import { useConstructUrl } from "@/hooks/use-construct-url";
import Image from "next/image";
import Link from "next/link";
import {
    ArrowRight,
    Pencil,
    Eye,
    MoreVertical,
    TimerIcon,
    School,
    Trash2,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminCourseCard({ course }: { course: AdminCourseType }) {
    const thumbnailUrl = useConstructUrl(course.fileKey) ?? "/default-thumbnail.png";

    return (
        <Card className="group relative py-0 gap-y-0">
            {/* Dropdown Menu */}
            <div className="absolute top-2 right-2 z-10">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon" aria-label="Course Options">
                            <MoreVertical className="size-4" />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-48">
                        <Link href={`/admin/courses/${course.id}/edit`} passHref>
                            <DropdownMenuItem className="flex items-center gap-x-2 cursor-pointer">
                                <Pencil className="size-4" />
                                Edit Course
                            </DropdownMenuItem>
                        </Link>

                        <Link href={`/courses/${course.slug}`} passHref>
                            <DropdownMenuItem className="flex items-center gap-x-2 cursor-pointer">
                                <Eye className="size-4" />
                                Preview
                            </DropdownMenuItem>
                        </Link>

                        <Link href={`/admin/courses/${course.id}/delete`} passHref>
                            <DropdownMenuItem className="flex items-center gap-x-2 cursor-pointer">
                                <Trash2 className="size-4" />
                                Delete Course
                            </DropdownMenuItem>
                        </Link>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Thumbnail */}
            <Image
                src={thumbnailUrl}
                alt={course.title || "Course image"}
                width={600}
                height={400}
                className="w-full rounded-t-lg object-cover aspect-video h-full group-hover:opacity-80 transition-opacity duration-300"
            />

            {/* Card Content */}
            <CardContent className="p-4">
                <Link
                    href={`/admin/courses/${course.id}`}
                    className="font-semibold text-xl line-clamp-1 hover:underline group-hover:text-primary tracking-colors"
                >
                    {course.title}
                </Link>

                <p className="text-sm text-muted-foreground line-clamp-2 leading-tight mt-2">
                    {course.smallDescription}
                </p>

                {/* Duration and Level */}
                <div className="mt-4 flex items-center gap-x-6">
                    <div>
                        <TimerIcon className="size-6 text-primary bg-primary/10 inline-block mr-1 rounded-sm p-0.5" />
                        <span className="text-sm text-muted-foreground">{course.duration}</span>
                    </div>

                    <div>
                        <School className="size-6 text-primary bg-primary/10 inline-block mr-1 rounded-sm p-0.5" />
                        <span className="text-sm text-muted-foreground">{course.level}</span>
                    </div>
                </div>

                {/* Edit Button */}
                <Link
                    href={`/admin/courses/${course.id}/edit`}
                    className={buttonVariants({ className: "w-full mt-4" })}
                >
                    Edit Course
                    <ArrowRight className="size-4 ml-2" />
                </Link>
            </CardContent>
        </Card>
    );
}


export function AdminCourseCardSkeleton() {
    return (
        <Card className="group relative py-0 gap-0">
            <div className="absolute top-2 right-2 z-10 flex item-center gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="size-8 rounded-md" />

            </div>

            <div className="w-full relative h-fit">
                <Skeleton className="w-full aspect-video h-[250px] rounded-t-lg object-cover" />
            </div>

            <CardContent className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2 rounded" />
                <Skeleton className="h-4 w-full mb-4 rounded" />
                <div className="mt-4 flex items-center gap-x-5">
                    <div className="flex items-center gap-x-2">
                        <Skeleton className="size-6 rounded-md" />
                        <Skeleton className="h-4 w-10 rounded" />
                    </div>
                    <div className="flex items-center gap-x-2">
                        <Skeleton className="size-6 rounded-md" />
                        <Skeleton className="h-4 w-10 rounded" />
                    </div>
                </div>

                <Skeleton className="h-10 w-full mt-4 rounded" />
            </CardContent>

        </Card>
    )
}