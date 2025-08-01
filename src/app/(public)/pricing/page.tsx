"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { becameInstructor } from "../actions/became-instroctor";
import { tryCatch } from "@/hooks/try-catch";

const plans = [
  {
    id: "starter",
    name: "Starter",
    label: "Free",
    description: "Perfect for individuals exploring the platform.",
    price: { monthly: 0, yearly: 0 },
    features: ["3 courses", "50 students", "Basic analytics", "Community support"],
    cta: "Get Started Free",
    popular: false,
    buttonColor: "bg-primary hover:bg-primary/90 text-primary-foreground",
    badgeColor: "bg-green-500 text-white",
    cardColor: "bg-muted",
    available: true,
  },
  {
    id: "professional",
    name: "Professional",
    label: "Most Popular",
    description: "Ideal for educators scaling their platform.",
    price: { monthly: 79, yearly: 790 },
    features: [
      "Unlimited courses",
      "Unlimited students",
      "Advanced analytics",
      "Priority support",
      "Custom branding",
      "Advanced certificates",
    ],
    cta: "Choose Professional",
    popular: true,
    buttonColor: "bg-primary hover:bg-primary/90 text-primary-foreground",
    badgeColor: "bg-primary text-primary-foreground",
    cardColor: "bg-card",
    available: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    label: null,
    description: "For large institutions with custom needs.",
    price: { monthly: 199, yearly: 1990 },
    features: [
      "Everything in Professional",
      "Dedicated account manager",
      "Custom integrations",
      "SSO & advanced security",
    ],
    cta: "Choose Enterprise",
    popular: false,
    buttonColor: "bg-primary hover:bg-primary/90 text-primary-foreground",
    badgeColor: "bg-orange-500/90 text-white",
    cardColor: "bg-muted",
    available: true,
  },
];

interface PricingProps {
  showInstructorFlow?: boolean;
}


export default function Pricing({ showInstructorFlow = false }: PricingProps) {
  const [isYearly, setIsYearly] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [clickedPlan, setClickedPlan] = useState<string | null>(null);
  const router = useRouter();


  // ✅ Handle card selection (visual selection)
  const handleCardClick = (planId: string) => {
    setClickedPlan(planId);
  };

  // ✅ Handle plan selection (actual functionality)
  const handlePlanSelection = (planId: string) => {
    // Only allow free plan for now
    if (planId !== "starter") {
      toast.info("Only the free plan is available for now. Paid plans coming soon!");
      return;
    }

    setSelectedPlan(planId);

    startTransition(async () => {
      const { data, error } = await tryCatch(becameInstructor(planId));

      if (error) {
        toast.error("Something went wrong. Please try again.");
        return;
      }

      setSelectedPlan(null);

      if (data?.status === "success") {
        toast.success(data.message);
        // Redirect to dashboard or wherever appropriate
        router.push("/admin/dashboard");
      } else {
        toast.error(data?.message || "Something went wrong. Please try again.");
      }
    });
  };

  return (
    <section id="pricing" className="relative py-10">
      {/* Background glow behind middle card */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[500px] w-[300px] rounded-full bg-primary/20 blur-[100px] opacity-60 transition-all" />

      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <Badge variant="secondary" className="bg-primary/10 text-primary mb-4">
            Pricing
          </Badge>
          <h2 className="text-4xl font-bold text-foreground mb-4">
            {showInstructorFlow ? "Choose Your Instructor Plan" : "Transparent Plans for Every Stage"}
          </h2>
          <p className="text-muted-foreground text-lg">
            {showInstructorFlow
              ? "Start your teaching journey with our free plan. Upgrade anytime as you grow."
              : "Choose a plan that grows with your journey."}
          </p>
          {!showInstructorFlow && (
            <div className="flex items-center justify-center gap-3 mt-8">
              <span className={`text-sm ${!isYearly ? "text-foreground" : "text-muted-foreground"}`}>
                Monthly
              </span>
              <Switch checked={isYearly} onCheckedChange={setIsYearly} />
              <span className={`text-sm ${isYearly ? "text-foreground" : "text-muted-foreground"}`}>
                Yearly
              </span>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                Save 20%
              </Badge>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-10 md:gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => {
            const isPopular = plan.popular;
            const isEnterprise = plan.name === "Enterprise";
            const isMiddleCard = index === 1;
            const isLoading = isPending && selectedPlan === plan.id;
            const isSelected = clickedPlan === plan.id;

            return (
              <Card
                key={index}
                className={`relative transition-all duration-300 ${plan.cardColor} rounded-xl border cursor-pointer hover:shadow-lg
                  ${isPopular ? "ring-1 ring-primary md:scale-[1.03] z-10 professional-glow hover:ring-2 hover:ring-primary" : ""}
                  ${isMiddleCard ? "md:pt-6 md:pb-4" : "md:pb-4 md:self-center"}
                  ${isSelected ? "ring-2 ring-primary shadow-lg scale-[1.02]" : ""} 
                `}
                onClick={() => handleCardClick(plan.id)}
              >
                {plan.label && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className={`text-xs font-medium px-3 py-1 ${plan.badgeColor}`}>
                      {plan.label}
                    </Badge>
                  </div>
                )}

                {/* ✅ Selection indicator */}
                {isSelected && (
                  <div className="absolute -top-2 -right-2">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}

                <CardHeader className="text-center mb-2">
                  <CardTitle className="text-xl font-semibold text-foreground">
                    {plan.name}
                  </CardTitle>
                  <p className="text-muted-foreground text-sm h-10">{plan.description}</p>
                </CardHeader>

                <CardContent>
                  <div className="flex justify-center items-end mb-6">
                    <span className="text-4xl font-bold text-foreground">
                      {plan.price.monthly === 0 ? "Free" : `$${isYearly ? plan.price.yearly : plan.price.monthly}`}
                    </span>
                    {plan.price.monthly !== 0 && (
                      <span className="ml-2 text-muted-foreground text-sm">
                        /{isYearly ? "year" : "month"}
                      </span>
                    )}
                  </div>
                  <ul className="space-y-2 text-sm text-left">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <Check
                          className={`h-4 w-4 mr-2 ${isMiddleCard
                            ? "text-primary"
                            : isEnterprise
                              ? "text-orange-500"
                              : "text-green-500"
                            }`}
                        />
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="pt-6 px-6">
                  <Button
                    className={`w-full ${plan.buttonColor}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlanSelection(plan.id);
                    }}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Setting up...
                      </>
                    ) : (
                      plan.cta
                    )}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-8 text-muted-foreground text-sm">
          {showInstructorFlow
            ? "Start teaching immediately with our free plan. No credit card required."
            : "All plans include a 14-day free trial. No credit card required."}
        </div>
      </div>

      <style jsx global>{`
        .professional-glow {
          box-shadow: 0 10px 40px 10px var(--tw-shadow-color, rgba(0, 112, 243, 0.15));
        }
        @keyframes subtle-float {
          0%,
          100% {
            transform: translateY(0) scale(1.03);
          }
          50% {
            transform: translateY(-6px) scale(1.03);
          }
        }
        @media (min-width: 768px) {
          .professional-glow {
            animation: subtle-float 6s ease-in-out infinite;
          }
        }
      `}</style>
    </section>
  );
};
