import { buttonVariants } from "@/components/ui/button";
import { CirclePlus, PenBox } from "lucide-react";
import Link from "next/link";
import { IconCirclePlusFilled, type Icon } from "@tabler/icons-react";

export default function CoursesPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Courses</h1>
        <Link className={buttonVariants()} href="courses/create">
          <IconCirclePlusFilled  />
          <span>Create Course</span>
        </Link>
      </div>

      <div>
        <h1>Here you will see all of your courses</h1>
      </div>
    </>
  );
}
