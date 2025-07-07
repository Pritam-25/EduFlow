import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link"; 

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Link href="/" className="absolute left-4 top-4">
        <Button variant="outline">
          <ArrowLeft className="size-4 mr-2" />
          Back
        </Button>
      </Link>

      <div className="flex w-full max-w-md flex-col gap-6">
        {children}
      </div>
    </div>
  );
}
