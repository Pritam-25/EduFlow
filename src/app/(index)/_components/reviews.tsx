"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

export const Reviews = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  const reviews = [
    {
      name: "Anjali Sharma",
      role: "Course Creator",
      rating: 5,
      review:
        "EduFlow transformed how I deliver my courses. Student engagement has increased by 40%!",
      avatar: "AS",
    },
    {
      name: "Marcus Johnson",
      role: "Online Instructor",
      rating: 5,
      review:
        "We switched to EduFlow 6 months ago. The platform is robust, support is excellent, and revenue grew 60%.",
      avatar: "MJ",
    },
    {
      name: "Sarah Chen",
      role: "Language Coach",
      rating: 5,
      review:
        "The interface is intuitive and my students love the experience. Best investment I've made!",
      avatar: "SC",
    },
    {
      name: "David Lee",
      role: "STEM Tutor",
      rating: 4,
      review:
        "EduFlow is a reliable teaching companion. Minor feature gaps but overall excellent.",
      avatar: "DL",
    },
    {
      name: "Aisha Kapoor",
      role: "Design Mentor",
      rating: 5,
      review:
        "Finally found a platform that supports creative education. Clean UI and great student feedback.",
      avatar: "AK",
    },
    {
      name: "Carlos Ramirez",
      role: "Coding Bootcamp Trainer",
      rating: 5,
      review:
        "Smooth onboarding and feature-rich. Certificates & branding options are top notch!",
      avatar: "CR",
    },
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoplay) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % reviews.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [autoplay, reviews.length]);

  const nextSlide = () => {
    setAutoplay(false);
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevSlide = () => {
    setAutoplay(false);
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  return (
    <section >
      
        <div className="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
          <Badge variant="secondary" className="bg-primary/10 text-primary mb-4">
            Testimonials
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Loved by Educators Worldwide
          </h2>
          <p className="text-muted-foreground">
            Join thousands of educators who’ve transformed their teaching with EduFlow.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {reviews.map((review, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  <Card className="bg-card border shadow-sm">
                    <CardContent className="p-8">
                      <div className="flex flex-col md:flex-row md:items-center gap-6 mb-6">
                        <div className="w-16 h-16 rounded-full border border-border flex items-center justify-center text-foreground font-semibold text-xl">
                          {review.avatar}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-foreground mb-1">
                            {review.name}
                          </h3>
                          <p className="text-muted-foreground text-sm">{review.role}</p>
                          <div className="flex items-center mt-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? "text-yellow-500 fill-yellow-500"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <blockquote className="text-lg text-foreground leading-relaxed italic">
                        “{review.review}”
                      </blockquote>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-2 md:px-0 md:-mx-5">
            <Button
              onClick={prevSlide}
              variant="secondary"
              size="icon"
              className="rounded-full w-10 h-10 bg-background shadow-sm border border-border hover:bg-muted"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              onClick={nextSlide}
              variant="secondary"
              size="icon"
              className="rounded-full w-10 h-10 bg-background shadow-sm border border-border hover:bg-muted"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex justify-center mt-6 space-x-2">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setAutoplay(false);
                  setCurrentIndex(index);
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-primary w-5"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                aria-label={`Go to review ${index + 1}`}
              />
            ))}
          </div>
        </div>
    </section>
  );
};
