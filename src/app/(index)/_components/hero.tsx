"use client";

import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowRight, Plus } from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { Role } from "@/generated/prisma";

export const Hero = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // ✅ Use the hook at component level
  const { data: session } = authClient.useSession();

  // ✅ Handle "Become an Instructor" action
  const handleBecomeInstructor = () => {
    startTransition(async () => {
      try {
        if (!session?.user) {
          // Redirect to login with instructor role
          router.push("/login?redirect=become-instructor");
          return;
        }

        toast.success("Welcome! Let's choose your plan");
        // Redirect to pricing/plan selection
        router.push("/pricing");
      } catch (error) {
        console.error("Error updating role:", error);
        toast.error("Something went wrong. Please try again.");
      }
    });
  };

  // ✅ Handle "Create Course" action for creators
  const handleCreateCourse = () => {
    startTransition(async () => {
      try {
        if (!session?.user) {
          router.push("/login");
          return;
        }

        if (session.user.role !== Role.CREATOR) {
          toast.error("Only instructors can create courses");
          return;
        }

        // Redirect to create course page
        router.push("/admin/courses/create");
      } catch (error) {
        console.error("Error creating course:", error);
        toast.error("Something went wrong. Please try again.");
      }
    });
  };

  // ✅ Determine which action to use
  const isCreator = session?.user?.role === Role.CREATOR;
  const primaryAction = isCreator ? handleCreateCourse : handleBecomeInstructor;
  const primaryButtonText = isCreator ? "Create New Course" : "Become an Instructor";
  const primaryButtonIcon = isCreator ? Plus : ArrowRight;

  // ✅ Determine explore courses URL
  const exploreCoursesUrl = isCreator ? "/admin/courses" : "/courses";
  const exploreCoursesText = isCreator ? "Manage Courses" : "Explore Courses";

  return (
    <section className="relative pt-24 top-0">
      {/* Animated, responsive background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div
          className="
          absolute 
          size-[300px] md:size-[400px] lg:size-[500px] 
          bg-gradient-to-r from-primary/20 to-orange/20 
          rounded-full 
          blur-[80px] md:blur-[100px] lg:blur-[120px] 
          animate-glow-pulse
        "
        />
        <div
          className="
          absolute 
          size-[300px] sm:size-[500px] md:size-[600px] lg:size-[700px] 
          bg-gradient-to-r from-orange/10 to-primary/10 
          rounded-full 
          blur-[80px] sm:blur-[100px] md:blur-[120px] lg:blur-[150px] 
          animate-float
        "
        />
      </div>

      {/* Foreground content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-fade-in leading-tight">
            <span className="block text-foreground">
              {isCreator ? "Grow Your Teaching" : "Transform Your Learning"}
            </span>
            <span className="block bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              with EduFlow LMS
            </span>
          </h1>

          <p
            className="text-base sm:text-lg md:text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            {isCreator
              ? "Create engaging courses, track student progress, and grow your educational business with powerful analytics."
              : "Everything you need to manage your courses — track student progress, automate assessments, and scale your educational brand with ease."
            }
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            {/* ✅ Primary Action Button - Conditional */}
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground hover:scale-105 transition-transform group px-8 py-6 text-lg"
              onClick={primaryAction}
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {isCreator ? "Creating..." : "Setting up..."}
                </>
              ) : (
                <>
                  {primaryButtonText}
                  {isCreator ? (
                    <Plus className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  ) : (
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  )}
                </>
              )}
            </Button>

            {/* ✅ Secondary Action Button - Conditional */}
            <Link
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className:
                  "border-border hover:bg-card hover:scale-105 transition-transform px-8 py-6 text-lg",
              })}
              href={exploreCoursesUrl}
            >
              {exploreCoursesText}
            </Link>
          </div>

          {/* ✅ Role-specific additional info */}
          {isCreator && (
            <div className="mt-6 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: "0.6s" }}>
              <p>✨ Ready to create your next course? Get started in minutes!</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
