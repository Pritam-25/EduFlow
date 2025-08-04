import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, Play } from "lucide-react";
import Link from "next/link";

interface LessonItemProps {
  lesson: {
    id: string;
    title: string;
    position: number;
    description: string | null;
  };
  slug: string;
  isActive?: boolean;
}

export default function LessonItem({
  lesson,
  slug,
  isActive,
}: LessonItemProps) {
  const completed = false;

  return (
    <Link
      href={`/dashboard/enrolled-courses/${slug}/${lesson.id}`}
      className={buttonVariants({
        variant: completed ? "secondary" : "outline",
        className: cn(
          "w-full p-3 h-auto flex items-center justify-between gap-2 transition-all bg-background/30 dark:bg-input/30",
          completed &&
          "bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700 hover:bg-green-200 dark:hover:bg-green-800 text-green-800 dark:text-green-200",

          isActive &&
          !completed &&
          "bg-primary/10 border-primary/50 hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30 text-primary"
        ),
      })}
    >
      <div className="flex items-center gap-3 w-full min-w-0">
        <div className="shrink-0">
          {completed ? (
            <div className="size-6 rounded-full border-2 bg-green-600 dark:bg-green-500 flex items-center justify-center">
              <Check className="size-4 text-white" />
            </div>
          ) : (
            <div
              className={cn(
                "size-6 rounded-full border-2 bg-background flex items-center justify-center",
                isActive ? "border-primary bg-primary/10 dark:bg-primary/20" : "border-muted-foreground/60"
              )}
            >
              <Play
                className={cn(
                  "size-2.5 fill-current",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              />
            </div>
          )}
        </div>

        <div className="flex-1 text-left">
          <p
            className={cn(
              "text-xs font-medium truncate",
              completed ? "text-green-800 dark:text-green-200" : isActive ? "text-primary font-semibold" : "text-foreground"
            )}
          >
            {lesson.position}. {lesson.title}
          </p>
          {completed && (
            <p className="text-[10px] text-green-700 dark:text-green-300 font-medium">
              Completed
            </p>
          )}

          {isActive && !completed && (
            <p className="text-[10px] text-primary/80 font-medium">
              Currently Watching
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
