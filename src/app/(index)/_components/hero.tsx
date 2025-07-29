"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const Hero = () => {
  const router = useRouter();
  return (
    <section className="relative pt-24 top-0">
      {/* Animated, responsive background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="
          absolute 
          size-[300px] md:size-[400px] lg:size-[500px] 
          bg-gradient-to-r from-primary/20 to-orange/20 
          rounded-full 
          blur-[80px] md:blur-[100px] lg:blur-[120px] 
          animate-glow-pulse
        " />
        <div className="
          absolute 
          size-[300px] sm:size-[500px] md:size-[600px] lg:size-[700px] 
          bg-gradient-to-r from-orange/10 to-primary/10 
          rounded-full 
          blur-[80px] sm:blur-[100px] md:blur-[120px] lg:blur-[150px] 
          animate-float
        " />
      </div>

      {/* Foreground content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-fade-in leading-tight">
            <span className="block text-foreground">Transform Your Learning</span>
            <span className="block bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              with EduFlow LMS
            </span>
          </h1>

          <p
            className="text-base sm:text-lg md:text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            Everything you need to manage your courses — track student progress, automate assessments, and scale your educational brand with ease.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground hover:scale-105 transition-transform group px-8 py-6 text-lg"
              onClick={() => router.push("/admin/dashboard")}
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-border hover:bg-card hover:scale-105 transition-transform px-8 py-6 text-lg"
              onClick={() => router.push("/demo")}
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
