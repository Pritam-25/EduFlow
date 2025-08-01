import { Gitlab } from "lucide-react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { headers } from "next/headers";
import { SignUpForm } from "./_component/signUp-form";

interface PageProps {
  searchParams: Promise<{ "become-instructor": string }>; // Fix: Make it a Promise for Next.js 15
}

export default async function SignUpPage({ searchParams }: PageProps) {
  //* get user session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const params = await searchParams;
  const redirectTo = params["become-instructor"];

  // After successful login/verification:
  if (redirectTo === "become-instructor") {
    redirect("/pricing");
  } else if (redirectTo === "pricing") {
    redirect("/pricing");
  }


  //* if user have session, redirect to home page
  if (session) {
    return redirect("/");
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link href="/" className="flex items-center gap-2 self-center font-medium">
          <Gitlab className="size-6 font-bold text-primary" />
          <span className="text-lg font-semibold">
            Edu<span className="text-primary">Flow</span>
          </span>
        </Link>
        <SignUpForm />
      </div>
    </div>
  );
}
