"use client";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useConfetti } from "@/hooks/use-confetti";
import { ArrowLeft, XIcon } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function PaymentSuccess() {
  const {triggerConfetti} = useConfetti();

  useEffect(()=>{
    triggerConfetti();
  }, [triggerConfetti])

  return (
    <div className="w-full min-h-screen flex flex-1 justify-center items-center">
      <Card className="w-[350px]">
        <CardContent>
          <div className="w-full flex justify-center">
            <XIcon className="size-12 p-2 bg-green-500/30 text-green-500 rounded-full" />
          </div>
          <div className="mt-3 text-center sm:mt-5 w-full">
            <h2 className="text-xl font-semibold">Payment Successful</h2>
            <p className="text-sm text-muted-foreground tracking-tight mt-2">
              Congrats your payment was successful! You can access your course now.
            </p>

            <Link href="/" className={buttonVariants({variant:"outline", className: "w-full mt-4"})}>
            <ArrowLeft className="mr-2 size-4" />
              Go back to Dashboard
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

