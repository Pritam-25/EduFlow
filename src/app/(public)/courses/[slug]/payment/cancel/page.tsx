import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, XIcon } from "lucide-react";
import Link from "next/link";

export default function PaymentCancelled() {
  return (
    <div className="w-full min-h-screen flex flex-1 justify-center items-center">
      <Card className="w-[350px]">
        <CardContent>
          <div className="w-full flex justify-center">
            <XIcon className="size-12 p-2 bg-red-500/30 text-red-500 rounded-full" />
          </div>
          <div className="mt-3 text-center sm:mt-5 w-full">
            <h2 className="text-xl font-semibold">Payment Cancelled</h2>
            <p className="text-sm text-muted-foreground tracking-tight mt-2">
              Your payment has been cancelled. No worries, you won&apos;t be charged.
            </p>

            <Link href="/" className={buttonVariants({variant:"default", className: "w-full mt-4"})}>
            <ArrowLeft className="mr-2 size-4" />
              Go back to home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

