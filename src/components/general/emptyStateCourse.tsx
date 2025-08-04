import { IconCirclePlusFilled } from "@tabler/icons-react";
import { Ban } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function EmptyCoursePage({ title, description, buttonText, href }: {
  title: string;
  description: string;
  buttonText: string;
  href: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center border border-border rounded-lg p-8 flex-1 shadow-sm animate-in fade-in-50">
      <div className="flex items-center justify-center size-20 rounded-full bg-primary/10 mb-4">
        <Ban className="size-10 text-primary" />
      </div>

      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-sm text-muted-foreground mb-6">
        {description}
      </p>

      <Link
        href={href}
        className={buttonVariants({ variant: "default", size: "sm" }) + " flex items-center gap-2"}
      >
        <IconCirclePlusFilled className="size-4" />
        {buttonText}
      </Link>
    </div>
  );
}
