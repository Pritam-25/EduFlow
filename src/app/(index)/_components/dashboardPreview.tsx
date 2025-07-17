"use client"
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export const DashboardPreview = () => {
  return (
    <section className="hidden md:block py-10  bg-transparent">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-10 md:mb-16 max-w-3xl mx-auto">
          <Badge variant="secondary" className="bg-primary/10 text-primary mb-4">
            Intuitive Dashboard
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Streamlined Learning Management
          </h2>
          <p className="text-muted-foreground">
            A beautiful, modern interface that makes course creation and student management effortless.
          </p>
        </div>

        <div className="relative rounded-xl overflow-hidden border border-border shadow-xl max-w-5xl mx-auto dashboard-glow transition-all duration-500 ease-in-out hover:scale-[1.02]">
          {/* Replace with your actual dashboard screenshot */}
          <div className="aspect-[16/9] bg-card/50 relative">
            <div className="absolute inset-0 flex items-center justify-center text-muted p-8">
              <div className="w-full max-w-4xl bg-card rounded-lg border border-border shadow-lg p-6">
                <div className="flex items-center justify-between pb-5 border-b border-border mb-6">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-2xl bg-primary flex items-center justify-center">
                      <span className="text-primary-foreground font-bold">E</span>
                    </div>
                    <h3 className="font-semibold text-lg text-muted-foreground">EduFlow Dashboard</h3>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-muted"></div>
                    <div className="w-8 h-8 rounded-full bg-muted"></div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 grid gap-4">
                    <div className="bg-muted/50 rounded-lg h-40"></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-muted/50 rounded-lg h-32"></div>
                      <div className="bg-muted/50 rounded-lg h-32"></div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-muted/50 rounded-lg p-4 h-24">
                      
                    </div>
                    <div className="bg-muted/50 rounded-lg h-32"></div>
                    <div className="bg-muted/50 rounded-lg h-16"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Optional: Add your actual dashboard screenshot here */}
            {/* <Image 
              src="/dashboard-screenshot.png" 
              alt="EduFlow LMS Dashboard" 
              fill 
              className="object-cover"
              quality={90}
            /> */}
          </div>

          {/* Browser chrome effect */}
          <div className="absolute top-0 left-0 right-0 h-8 bg-muted/80 backdrop-blur-sm flex items-center px-4">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-rose-500"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Add CSS for glow effect */}
      <style jsx global>{`
        .dashboard-glow {
          box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.1),
                      0 0 20px 0px rgba(0, 112, 243, 0.1);
          transform: translateY(0);
          transition: all 0.5s ease;
        }
        
        .dashboard-glow:hover {
          box-shadow: 0 20px 60px -10px rgba(0, 0, 0, 0.15),
                      0 0 40px 0px rgba(0, 112, 243, 0.25);
          transform: translateY(-10px);
        }
        
        @media (prefers-reduced-motion) {
          .dashboard-glow:hover {
            transform: none;
          }
        }
      `}</style>
    </section>
  );
};