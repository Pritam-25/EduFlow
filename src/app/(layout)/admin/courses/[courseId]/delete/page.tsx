"use client"

import { useEffect, useState, useTransition } from "react"
import { useParams, useRouter } from "next/navigation"
import { tryCatch } from "@/hooks/try-catch"
import { toast } from "sonner"

import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2, Trash2, AlertTriangle } from "lucide-react"
import { getCourseMeta } from "../../../actions/getCourseMeta"
import { deleteCourse } from "../../../actions/deleteCourse"

export default function DeleteCoursePage() {
  const router = useRouter()
  const { courseId } = useParams<{ courseId: string }>()
  const [pending, startTransition] = useTransition()

  const [meta, setMeta] = useState<{
    name: string
    chapterCount: number
    lessonCount: number
  } | null>(null)

  useEffect(() => {
    async function loadMeta() {
      const data = await getCourseMeta(courseId)
      setMeta(data)
    }

    loadMeta()
  }, [courseId])

  function onDelete() {
    startTransition(async () => {
      const { data, error } = await tryCatch(deleteCourse({ courseId }))

      if (error) {
        toast.error("Failed to delete")
        return
      }

      if (data?.status === "success") {
        toast.success(data.message)
        router.push("/admin/courses")
      } else {
        toast.error(data?.message || "Something went wrong")
      }
    })
  }

  if (!meta) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center text-muted-foreground">
        <Loader2 className="animate-spin mb-4 h-8 w-8" />
        <p className="text-lg">Loading course information...</p>
      </div>
    )
  }

  return (
    <div className="h-full flex items-center justify-center">
      <div className="w-full max-w-2xl ">
        {/* Warning Banner */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-destructive/10 rounded-full mb-6">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-3">Delete Course</h1>
          <p className="text-lg text-muted-foreground">
            This action is permanent and cannot be undone
          </p>
        </div>

        <Card className="shadow-2xl border-destructive/20  px-10">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-2xl font-semibold text-foreground mb-6">
              &quot;{meta.name}&quot;
            </CardTitle>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className=" bg-white/80 dark:bg-muted/80  rounded-xl px-0 py-6">
                <div className="text-3xl font-bold text-foreground mb-1">{meta.chapterCount}</div>
                <div className="text-sm text-muted-foreground">
                  Chapter{meta.chapterCount !== 1 && "s"}
                </div>
              </div>
              <div className="bg-white/80 dark:bg-muted/80 rounded-xl px-0 py-6">
                <div className="text-3xl font-bold text-foreground mb-1">{meta.lessonCount}</div>
                <div className="text-sm text-muted-foreground">
                  Lesson{meta.lessonCount !== 1 && "s"}
                </div>
              </div>
            </div>

            <CardDescription className="text-base leading-relaxed text-muted-foreground max-w-md mx-auto">
              All course content, including chapters, lessons, and student progress will be permanently removed.
              <br />
              <span className="font-semibold text-destructive mt-3 block">
                This action cannot be undone.
              </span>
            </CardDescription>
          </CardHeader>

          <CardFooter className="flex justify-center gap-4 pb-8">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="px-8 py-3 text-base h-12 min-w-[140px]"
              disabled={pending}
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Go Back
            </Button>

            <Button
              variant="destructive"
              onClick={onDelete}
              disabled={pending}
              className="px-8 py-3 text-base h-12 min-w-[140px]"
            >
              {pending ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-1 h-4 w-4" />
                  Delete Course
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
