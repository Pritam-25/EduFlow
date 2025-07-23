import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ChapterSchema, ChapterSchemaType } from "@/lib/zodSchema";
import { Plus } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { tryCatch } from "@/hooks/try-catch";
import { createChapter } from "@/app/(layout)/admin/actions/createChapter";
import { toast } from "sonner";


export default function NewChapterModal({ courseId }: { courseId: string }) {

  const [isOpen, setIsOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  //* 1. Define your form.
  const form = useForm<ChapterSchemaType>({
    resolver: zodResolver(ChapterSchema),
    defaultValues: {
      title: "",
      courseId: courseId,
    },
  });

  async function onSubmit(data: ChapterSchemaType) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        createChapter(data)
      );
      console.log("Form submitted with data:", data);
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
     if(!open){
      form.reset(); // Reset the form when the modal is closed
    }
    setIsOpen(open);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          New Chapter
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Chapter</DialogTitle>
          <DialogDescription>
            What would you like to name your new chapter?
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={(e) => {
            console.log("Submit button clicked");
            form.handleSubmit(onSubmit)(e);
          }}
            className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chapter Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Chapter Title" {...field} />
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

