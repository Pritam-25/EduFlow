import { deleteLesson } from "@/app/(layout)/admin/actions/deleteLesson"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { tryCatch } from "@/hooks/try-catch"
import { Trash, Trash2 } from "lucide-react"
import { useState, useTransition } from "react"
import { toast } from "sonner"

export function DeleteLessonDialog({ lessonId, chapterId, courseId }:{lessonId: string, chapterId: string, courseId: string}) {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()

  async function handleDelete() {
    startTransition(async () => {
      const {data: result, error} = await tryCatch(deleteLesson({lessonId, chapterId, courseId}))

      if(error){
        toast.error(error.message)
      }

      if(result?.status === "success") {
        toast.success(result.message)
        setOpen(false)
      }
      if(result?.status === "error") {
        toast.error(result.message)
      }

    });
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size={"icon"}>
          <Trash2 className="size-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this lesson.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={pending} onClick={handleDelete}>{pending ? "Deleting..." : "Delete"}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
