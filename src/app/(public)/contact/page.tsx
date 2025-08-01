// src/app/(public)/contact/page.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Mail,
  Clock,
  Send,
  MessageCircle,
  User,
  HelpCircle,
  CheckCircle,
  ArrowRight,
  BookOpen,
  CreditCard
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { firstName, lastName, email, subject, message } = formData;
    const fullName = `${firstName} ${lastName}`.trim();

    const emailSubject = encodeURIComponent(subject || 'EduFlow LMS Contact');
    const emailBody = encodeURIComponent(
      `Name: ${fullName}\nEmail: ${email}\n\nMessage:\n${message}`
    );

    await new Promise(resolve => setTimeout(resolve, 1000));
    window.open(`mailto:maityp394@gmail.com?subject=${emailSubject}&body=${emailBody}`);

    setIsSubmitting(false);

    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const quickActions = [
    {
      label: "Browse Courses",
      link: "/courses",
      icon: <BookOpen className="h-5 w-5" />
    },
    {
      label: "View Pricing",
      link: "/pricing",
      icon: <CreditCard className="h-5 w-5" />
    },
    {
      label: "Direct Email",
      link: "mailto:maityp394@gmail.com",
      icon: <Mail className="h-5 w-5" />
    }
  ];

  const faqs = [
    {
      q: "How do I get started?",
      a: "Simply sign up for a free account and choose your role. Start exploring or creating courses immediately."
    },
    {
      q: "Is there a free plan?",
      a: "Yes! Our starter plan includes 3 courses, 50 students, and basic analytics at no cost."
    },
    {
      q: "Can I create courses?",
      a: "Absolutely! Switch to instructor mode and use our intuitive course builder to create engaging content."
    },
    {
      q: "Need technical support?",
      a: "Email me directly at maityp394@gmail.com. I typically respond within 24 hours."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-transparent">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent"></div>
        <div className="container mx-auto px-4 text-center relative z-10 max-w-4xl">
          <Badge variant="outline" className="mb-6 px-6 py-2 border-primary/20 bg-background/80 backdrop-blur-sm">
            <MessageCircle className="h-4 w-4 mr-2 " />
            Contact Support
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-primary">
            Get In Touch
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Have questions about EduFlow LMS? I&apos;m here to help you succeed with personalized support and guidance.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

            {/* Contact Information - Left Side */}
            <div className="space-y-8">
              {/* Contact Header */}
              <div className="text-center lg:text-left">
                <h2 className="text-3xl font-bold mb-4">Let&apos;s Connect</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  I&apos;m <span className="font-semibold text-primary">Pritam Maity</span>, creator of EduFlow LMS.
                  Ready to help with any questions or support you need.
                </p>
              </div>

              {/* Contact Cards */}
              <div className="grid gap-4">
                <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary">
                  <CardContent className="flex items-center gap-4 py-1 px-6">
                    <div className="bg-primary/10 p-3 rounded-full group-hover:bg-primary/20 transition-colors">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Email</h3>
                      <a href="mailto:maityp394@gmail.com" className="text-primary hover:underline text-sm">
                        maityp394@gmail.com
                      </a>
                    </div>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
                  <CardContent className="flex items-center gap-4 py-1 px-6">
                    <div className="bg-blue-500/10 p-3 rounded-full group-hover:bg-blue-500/20 transition-colors">
                      <User className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Creator</h3>
                      <p className="text-muted-foreground text-sm">Pritam Maity</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500">
                  <CardContent className="flex items-center gap-4 py-1 px-6">
                    <div className="bg-green-500/10 p-3 rounded-full group-hover:bg-green-500/20 transition-colors">
                      <Clock className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Response Time</h3>
                      <p className="text-muted-foreground text-sm">Within 24 hours</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-center lg:text-left">Quick Actions</h3>
                <div className="grid gap-3">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      asChild
                      className="h-10 justify-between group hover:bg-primary/5 border-muted-foreground/20"
                    >
                      <Link href={action.link}>
                        <div className="flex items-center gap-3">
                          {action.icon}
                          <span className="font-medium">{action.label}</span>
                        </div>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form - Right Side */}
            <Card className="shadow-xl border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-8">
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                  <Send className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl font-bold">Send Message</CardTitle>
                <CardDescription>
                  Fill out the form below and I&apos;ll respond as soon as possible.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="border-muted-foreground/20 focus:border-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="border-muted-foreground/20 focus:border-primary"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="border-muted-foreground/20 focus:border-primary"
                    />
                  </div>

                  {/* Subject */}
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-sm font-medium">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="How can I help you?"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="border-muted-foreground/20 focus:border-primary"
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm font-medium">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell me about your question or how I can help you..."
                      className="min-h-[120px] resize-none border-muted-foreground/20 focus:border-primary"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-medium bg-primary hover:bg-primary/90 transition-all duration-200"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-background relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent"></div>

        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-6 px-6 py-2 border-primary/20 bg-background/80 backdrop-blur-sm">
              <HelpCircle className="h-4 w-4 mr-2" />
              Frequently Asked Questions
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Quick Answers</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Common questions about EduFlow LMS. Need more help? Contact me directly.
            </p>
          </div>

          {/* FAQ Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {faqs.map((faq, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300 bg-background/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-green-500/10 p-2 rounded-full mt-1 group-hover:bg-green-500/20 transition-colors">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-3">{faq.q}</h3>
                      <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <Card className="inline-block p-8 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 backdrop-blur-sm">
              <div className="space-y-6 w-full">
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Still have questions?</h3>
                  <p className="text-muted-foreground">
                    I&apos;m here to help you make the most of EduFlow LMS.
                  </p>
                </div>
                <Button asChild size="lg" className="px-8">
                  <a href="mailto:maityp394@gmail.com?subject=EduFlow LMS Question">
                    <Mail className="h-5 w-5 mr-2" />
                    Email Me Directly
                  </a>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}