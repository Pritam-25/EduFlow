import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { LessonSchema, LessonSchemaType } from "@/lib/zodSchema";
import { Plus } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { tryCatch } from "@/hooks/try-catch";
import { toast } from "sonner";
import { CreateLesson } from "@/app/(layout)/admin/actions/createLesson";


export default function NewLessonModal({ courseId, chapterId }: { courseId: string, chapterId: string }) {

  const [isOpen, setIsOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  //* 1. Define your form.
  const form = useForm<LessonSchemaType>({
    resolver: zodResolver(LessonSchema),
    defaultValues: {
      title: "",
      courseId: courseId,
      chapterId: chapterId,
    },
  });

  async function onSubmit(data: LessonSchemaType) {
    startTransition(async () => {

      const { data: result, error } = await tryCatch(
        CreateLesson(data)
      );

      console.log("Result:", result, "Error:", error);


      if (error) {
        toast.error(error.message);
        return;
      }

      if (result.status === "error") {
        toast.error(result.message);
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        form.reset();
        setIsOpen(false); // Close the modal after submission
      }
    });
  }

  function handleOpenChange(open: boolean) {
    setIsOpen(open);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className= "w-full">
          <Plus className="mr-2 h-4 w-4" />
          New Lesson
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Lesson</DialogTitle>
          <DialogDescription>
            What would you like to name your new lesson?
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={(e) => {
            form.handleSubmit(onSubmit)(e);
          }} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lesson Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Lesson Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button disabled={pending} type="submit">{
                pending ? "Saving..." : "Save Changes"
              }</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

