import { Card, CardContent } from "@/components/ui/card";
import { publicCoursesType } from "../actions/get-all-courses";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { School, TimerIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { Skeleton } from "@/components/ui/skeleton";

export default function PublicCourseCard({ course }: { course: publicCoursesType }) {


  const thumbnailUrl = useConstructUrl(course.fileKey);

  return (
    <Card className="group relative py-0 gap-0">
      <Badge className="absolute z-10 top-2 right-2">{course.level}</Badge>

      <Image
        src={thumbnailUrl!}
        alt={course.title}
        width={600}
        height={400}
        className="w-full h-full aspect-video object-cover rounded-t-md" />

      <CardContent className="p-4">
        <Link href={`/courses/${course.slug}`} className="font-medium line-clamp-2 text-lg hover:underline group-hover:text-primary transition-colors">
          {course.title}
        </Link>

        <p className="line-clamp-2 text-muted-foreground text-sm leading-tight mt-2">{course.smallDescription}</p>

        <div className="mt-4 flex items-center gap-x-5">
          <div className="flex items-center gap-x-2">
            <TimerIcon className="inline mr-1 size-6 bg-primary/10 p-1 text-primary" />
            <span className="text-sm text-muted-foreground">{course.duration}h</span>
          </div>
          <div className="flex items-center gap-x-2">
            <School className="inline mr-1 size-6 bg-primary/10 p-1 text-primary" />
            <span className="text-sm text-muted-foreground">{course.level}</span>
          </div>
        </div>

        <Link href={`/courses/${course.slug}`} className={buttonVariants({ className: "mt-4 w-full" })}>
          View Course
        </Link>
      </CardContent>
    </Card>
  );
}

export function PublicCourseCardSkeleton() {
  return (
    <Card className="group relative py-0 gap-0">
      <div className="absolute z-10 top-2 right-2 flex items-center">
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>


      <div className="w-full h-fit relative">
        <Skeleton className="w-full aspect-video rounded-t-md" />
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        <div className="mt-4 flex items-center gap-x-5">
          <div className="flex items-center gap-x-2">
            <Skeleton className="size-6 rounded-md" />
            <Skeleton className="h-4 w-8" />
          </div>
          <div className="flex items-center gap-x-2">
            <Skeleton className="size-6 rounded-md" />
            <Skeleton className="h-4 w-8" />
          </div>
        </div>
        <Skeleton className="mt-4 h-10 w-full rounded-md" />

      </CardContent>
    </Card>
  );
}

