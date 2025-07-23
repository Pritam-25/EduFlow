"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

const plans = [
	{
		name: "Starter",
		label: "Free",
		description: "Perfect for individuals exploring the platform.",
		price: { monthly: 0, yearly: 0 },
		features: ["3 courses", "50 students", "Basic analytics", "Community support"],
		cta: "Get Started Free",
		popular: false,
		buttonColor: "bg-primary/70 hover:bg-primary/80 text-primary-foreground dark:text-white hover:shadow-sm",
		badgeColor: "bg-green-500 text-white",
		cardColor: "bg-muted",
	},
	{
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
		cta: "Start Free Trial",
		popular: true,
		buttonColor: "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md hover:ring-2 hover:ring-primary/50",
		badgeColor: "bg-primary text-primary-foreground",
		cardColor: "bg-card",
	},
	{
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
		cta: "Contact Sales",
		popular: false,
		buttonColor: "bg-primary/70 hover:bg-primary/80 text-primary-foreground dark:text-white hover:shadow-sm",
		badgeColor: "bg-orange-500/90 text-white",
		cardColor: "bg-muted",
	},
];

export const Pricing = () => {
	const [isYearly, setIsYearly] = useState(false);

	return (
		<section id="pricing" className=" relative py-10">
			{/* Background glow behind middle card */}
			<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[500px] w-[300px] rounded-full bg-primary/20 blur-[100px] opacity-60 transition-all" />

			<div className="container mx-auto px-4 md:px-6">
				<div className="text-center mb-16 max-w-2xl mx-auto">
					<Badge variant="secondary" className="bg-primary/10 text-primary mb-4">
						Pricing
					</Badge>
					<h2 className="text-4xl font-bold text-foreground mb-4">
						Transparent Plans for Every Stage
					</h2>
					<p className="text-muted-foreground text-lg">
						Choose a plan that grows with your journey.
					</p>
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
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-y-10 md:gap-6 max-w-5xl mx-auto">
					{plans.map((plan, index) => {
						const isPopular = plan.popular;
						const isEnterprise = plan.name === "Enterprise";
						const isMiddleCard = index === 1;

						return (
							<Card
								key={index}
								className={`relative transition-all duration-300 ${plan.cardColor} rounded-xl border
									${isPopular ? "ring-1 ring-primary md:scale-[1.03] z-10 professional-glow hover:ring-2 hover:ring-primary" : ""}
									${isMiddleCard ? "md:py-6" : "md:py-4 md:self-center"}
								`}
							>
								{plan.label && (
									<div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
										<Badge className={`text-xs font-medium px-3 py-1 ${plan.badgeColor}`}>
											{plan.label}
										</Badge>
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
													className={`h-4 w-4 mr-2 ${
														isMiddleCard
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
									<Button className={`w-full ${plan.buttonColor}`}>
										{plan.cta}
									</Button>
								</CardFooter>
							</Card>
						);
					})}
				</div>

				<div className="text-center mt-8 text-muted-foreground text-sm">
					All plans include a 14-day free trial. No credit card required.
				</div>
			</div>

			<style jsx global>{`
				.professional-glow {
					box-shadow: 0 10px 40px 10px var(--tw-shadow-color, rgba(0, 112, 243, 0.15));
				}
				@keyframes subtle-float {
					0%, 100% {
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
