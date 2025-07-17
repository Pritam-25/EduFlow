"use client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, Zap, ChartLine } from "lucide-react";

export const Features = () => {
  const features = [
    {
      title: "Course Builder",
      description: "Create engaging courses with our intuitive drag-and-drop builder. Add videos, quizzes, and assignments easily.",
      icon: BookOpen,
      color: "bg-blue-500",
      borderHover: "hover:border-blue-500/40",
      gradient: "from-blue-400/10",
    },
    {
      title: "Analytics Dashboard",
      description: "Track student progress, engagement, and revenue with comprehensive analytics and visual reports.",
      icon: ChartLine,
      color: "bg-emerald-500",
      borderHover: "hover:border-emerald-500/40",
      gradient: "from-emerald-400/10",
    },
    {
      title: "Student Management",
      description: "Manage enrollments, communicate with students, and automate certificates and notifications.",
      icon: Users,
      color: "bg-amber-500",
      borderHover: "hover:border-amber-500/40",
      gradient: "from-amber-400/10",
    },
    {
      title: "Integrations",
      description: "Connect with your favorite tools including payment gateways, email marketing, and video platforms.",
      icon: Zap,
      color: "bg-purple-500",
      borderHover: "hover:border-purple-500/40",
      gradient: "from-purple-400/10",
    }
  ];

  return (
    <section id="features" className=" bg-transparent py-10 relative">
      {/* Soft radial background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.02),transparent_60%)] pointer-events-none z-0" />

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <Badge variant="secondary" className="bg-primary/10 text-primary mb-4">
            Features
          </Badge>
          <h2 className="text-4xl font-bold mb-4 text-foreground">
            Everything You Need to Succeed
          </h2>
          <p className="text-muted-foreground text-lg">
            Powerful tools designed specifically for online education and course creators.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 transition-all duration-300 ${feature.borderHover}`}
            >
              {/* Hover gradient overlay */}
              <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${feature.gradient} to-transparent`} />

              <div className="relative z-10 flex flex-col items-center text-center">
                <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-5 shadow-md`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
