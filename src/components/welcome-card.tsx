import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function WelcomeCard({ name = "Andrew" }) {
  return (
    <div className="w-full max-w-4xl">
      <Card className="relative  bg-muted/10 dark:bg-card overflow-hidden rounded-2xl  text-card-foreground border w-full">
        {/* 🎉 Confetti background */}
        <div className="absolute inset-0 pointer-events-none">
          <img
            src="/star-shape.png"
            alt=""
            className="w-full h-full object-fit"
          />
        </div>

        <CardContent className="relative z-10 px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-6">
          <div className="grid grid-cols-4 gap-4 items-start">
            {/* 📝 Text Section (takes 3/4 space) */}
            <div className="col-span-4 md:col-span-3 space-y-2 sm:space-y-3 md:space-y-4">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">
                Hi, {name}
                <span className="ml-1">👋</span>
              </h1>

              <h2 className="text-base md:text-lg lg:text-xl font-medium ">
                What do you want to learn today with your partner?
              </h2>

              <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
                Discover courses, track progress, and achieve your learning
                goals seamlessly.
              </p>

              <Button className="mt-2 w-full sm:w-auto">Explore Course</Button>
            </div>

            {/* 🖼️ Learner Image (takes 1/4 space, hidden on small screens) */}
            <div className="hidden md:block col-span-1 absolute bottom-0 right-0 md:right-4 lg:right-6 z-0 w-56 sm:w-56">
              {/* Light Mode */}
              <img
                src="/academy-dashboard-light.svg"
                alt="Learning dashboard"
                className="block dark:hidden w-full h-auto object-contain"
              />
              {/* Dark Mode */}
              <img
                src="/academy-dashboard-dark.svg"
                alt="Learning dashboard dark"
                className="hidden dark:block w-full h-auto object-contain"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
