"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { authClient } from "@/lib/auth-client";
import { Loader2, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";


interface VerifyEmailFormProps {
  email?: string;
}

export default function VerifyEmailForm({ email }: VerifyEmailFormProps) {

  const [otp, setOtp] = useState<string>("");
  const [emailPending, startTransition] = useTransition();
  const isOtpCompleted = otp.length === 6;
  const router = useRouter();

  // Handle OTP submission
  function verifyOtp() {
    if (otp.length !== 6) {
      console.log("Invalid OTP");
      return;
    }

    if (!email) {
      console.log("Email is required");
      return;
    }

    startTransition(async () => {
      await authClient.signIn.emailOtp({
        email: email,
        otp: otp,
        fetchOptions: {
          onSuccess: async () => {
            toast.success("OTP verified successfully");
            // Update user role after successful verification
            await authClient.updateUser({
              name: email.split("@")[0], // Use email prefix as name
            });
            // Redirect to the dashboard or home page after successful verification

            router.push("/");
          },
          onError: (error) => {
            toast.error("Error verifying OTP: " + error.error.message);
            // Handle error, e.g., show a toast notification
          }
        }
      });
    });
  }

  async function sendVerificationCode(): Promise<void> {

    if (!email) {
      toast.error("Email is required to send verification code");
      return;
    }

    await authClient.emailOtp.sendVerificationOtp({
      email: email,
      type: 'sign-in',
      fetchOptions: {
        onSuccess: async () => {
          toast.success(`Verification code sent to ${email}`);
          setOtp("");
        },
        onError: (error) => {
          toast.error(error.error.message);
        },
      },
    });
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-6 w-6 text-primary" />
          </div>
        </div>
        <CardTitle>Verify Your Email</CardTitle>
        <CardDescription className="mt-2">
          Please enter the verification code sent to your email address.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <InputOTP
            value={otp}
            onChange={(value) => setOtp(value)}
            maxLength={6}
            className="gap-2"
          >
            {[...Array(6)].map((_, i) => (
              <InputOTPGroup key={i}>
                <InputOTPSlot index={i} />
              </InputOTPGroup>
            ))}
          </InputOTP>

          <p className="text-xs text-muted-foreground text-center">
            Enter the 6-digit code sent to your email
          </p>

          <Button
            onClick={verifyOtp}
            disabled={emailPending || !isOtpCompleted}
            className="w-full"
          >
            {emailPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify Account'
            )}
          </Button>

          <div className="text-center flex gap-2 items-center">
            <p className="text-xs text-muted-foreground">
              Didn&apos;t receive the code?
            </p>

            <Button
              onClick={sendVerificationCode}
              variant="ghost"
              className="h-auto p-0 text-xs font-normal underline-offset-4 hover:underline"
            >
              Resend code
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}