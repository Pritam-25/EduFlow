"use client"

import { Button } from "@/components/ui/button";
import { tryCatch } from "@/hooks/try-catch";
import { Loader2 } from "lucide-react";
import { useTransition } from "react"
import { toast } from "sonner";
import { enrollInCourse } from "../actions/enrollInCourse";

export function EnrollmentButton({ courseId }: { courseId: string }) {
  const [pending, startTransition] = useTransition();

  function onSubmit(): void {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(enrollInCourse(courseId));

      if (error) {
        toast.error("An unexpected error occurred. Please try again.");
        return;
      }

      if (result.status === "error") {
        toast.error(result.message);
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        return;
      }
    })
  }

  return <Button
    disabled={pending}
    onClick={onSubmit}
    className="w-full"
  >
    {pending ? (<>
      <Loader2 className="mr-2 size-4 animate-spin" />Enrolling...</>) : (
      <>Enroll Now!</>
    )}
  </Button>
}