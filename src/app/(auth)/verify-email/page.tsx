import { Suspense } from "react";
import VerifyEmailForm from "./components/verify-email-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface PageProps {
  searchParams: Promise<{ email?: string; role?: string }>; // Fix: Make it a Promise for Next.js 15
}

export default async function VerifyEmailPage({ searchParams }: PageProps) {
  // Await the searchParams Promise
  const params = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Suspense fallback={<VerifyEmailSkeleton />}>
        <VerifyEmailForm
          email={params.email}
        />
      </Suspense>
    </div>
  );
}

function VerifyEmailSkeleton() {
  return (
     <Card className="w-full max-w-md">
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-6 w-6 text-primary" />
          </div>
        </div>
        <CardTitle>
          <Skeleton className="w-40 h-6 mx-auto" />
        </CardTitle>
        <CardDescription className="mt-2">
          <Skeleton className="w-60 h-4 mx-auto" />
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="w-10 h-12 rounded-md" />
            ))}
          </div>

          <Skeleton className="w-2/3 h-4" />

          <Skeleton className="w-full h-10 rounded-md" />

          <div className="flex gap-2 items-center justify-center">
            <Skeleton className="w-32 h-4" />
            <Skeleton className="w-20 h-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}