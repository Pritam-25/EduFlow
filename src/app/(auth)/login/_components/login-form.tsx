"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import React, { useTransition } from "react";
import { Loader } from "lucide-react";
import { Role } from "@/generated/prisma/client";
import { useRouter } from "next/navigation";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  // State management
  const [emailPending, startEmailTransition] = useTransition();

  const [email, setEmail] = React.useState("");
  const [selectedRole, setSelectedRole] = React.useState<Role>(Role.USER);
  const router = useRouter();

  // Email login (OTP-based)
  async function signInWithEmail(e: React.FormEvent) {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    startEmailTransition(async () => {
      try {
        // Use emailOTP sign in instead of email/password
        await authClient.emailOtp.sendVerificationOtp({
          email: email,
          type: 'sign-in',
          fetchOptions: {
            onSuccess: async () => {
              toast.success(`Verification code sent to ${email}`);
              router.push(`/verify-email?email=${encodeURIComponent(email)}&role=${selectedRole}`);
            },
            onError: (error) => {
              toast.error(error.error.message);
            },
          },
        });
      } catch (error) {
        console.error("Error sending verification code:", error);
        toast.error("An unexpected error occurred");
      }
    });
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Choose your role and login with email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={signInWithEmail}>
            <div className="grid gap-6">

              {/* Role Selection */}
              <div className="grid gap-2 w-full">
                <Label htmlFor="role">I am a</Label>
                <Select
                  value={selectedRole}
                  onValueChange={(value: Role) => setSelectedRole(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Role.USER}>
                      <div className="flex items-center gap-2">
                        <span>🎓</span>
                        <span>Student</span>
                      </div>
                    </SelectItem>
                    <SelectItem value={Role.ADMIN}>
                      <div className="flex items-center gap-2">
                        <span>👨‍🏫</span>
                        <span>Teacher</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Email OTP Login */}
              <div className="grid gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={emailPending || !selectedRole}
                >
                  {emailPending ? (
                    <>
                      <Loader className="size-4 animate-spin mr-2" />
                      Sending OTP...
                    </>
                  ) : (
                    `Continue as ${selectedRole === Role.ADMIN ? "Teacher" : "Student"}`
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="text-muted-foreground text-center text-xs text-balance">
        By clicking continue, you agree to our{" "}
        <a
          href="#"
          className="underline underline-offset-4 hover:text-primary"
        >
          Terms of Service
        </a>{" "}
        and{" "}
        <a
          href="#"
          className="underline underline-offset-4 hover:text-primary"
        >
          Privacy Policy
        </a>
        .
      </div>
    </div>
  );
}
