"use server";
import { ApiResponse } from "@/lib/types";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/require_user";
import { stripe } from "@/lib/stripe";
import { env } from "@/env";
import Stripe from "stripe";
import { redirect } from "next/navigation";
import { request } from "@arcjet/next";
import { ajProtect } from "@/lib/arcjet-protect";

export async function enrollInCourse(courseId: string): Promise<ApiResponse> {
  let checkoutUrl: string;

  console.log("🚀 ENROLLMENT STARTED", {
    courseId,
    timestamp: new Date().toISOString(),
  });

  try {
    console.log("🔐 Getting user session...");
    const session = await requireUser();
    const user = session.user;

    console.log("✅ User session retrieved:", {
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    console.log("🛡️ Checking Arcjet protection...");
    const req = await request();
    const decision = await ajProtect.protect(req, {
      fingerprint: user.id,
    });

    if (decision.isDenied()) {
      console.log("🚫 Arcjet denied request:", decision.reason);
      return {
        status: "error",
        message: "You have been blocked.",
      };
    }
    console.log("✅ Arcjet protection passed");

    console.log("📚 Fetching course details...");
    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        price: true, // This is in cents (Int)
        states: true, // Check if course is published
      }
    });

    if (!course) {
      console.log("❌ Course not found:", courseId);
      return {
        status: "error",
        message: "Course not found.",
      };
    }

    // Check if course is published
    if (course.states !== "PUBLISHED") {
      console.log("❌ Course not published:", course.states);
      return {
        status: "error",
        message: "This course is not available for enrollment.",
      };
    }

    console.log("✅ Course found:", {
      id: course.id,
      title: course.title,
      slug: course.slug,
      priceInCents: course.price, // Already in cents
      priceInDollars: course.price / 100, // Convert to dollars for display
      states: course.states,
    });

    // Handle free courses
    if (course.price === 0) {
      console.log("🆓 Free course detected - direct enrollment");

      try {
        await prisma.$transaction(async (tx) => {
          const existingEnrollment = await tx.enrollment.findUnique({
            where: {
              userId_courseId: {
                userId: user.id,
                courseId: course.id,
              }
            },
          });

          if (existingEnrollment?.status === "ACTIVE") {
            return {
              status: "error",
              message: "You are already enrolled in this course.",
            };
          }

          let enrollment;
          if (existingEnrollment) {
            enrollment = await tx.enrollment.update({
              where: { id: existingEnrollment.id },
              data: {
                status: "ACTIVE", // Direct activation for free courses
                amount: 0,
              },
            });
          } else {
            enrollment = await tx.enrollment.create({
              data: {
                userId: user.id,
                courseId: course.id,
                status: "ACTIVE", // Direct activation for free courses
                amount: 0,
              },
            });
          }

          return { enrollment };
        });

        console.log("✅ Free course enrollment completed");
        return {
          status: "success",
          message: "You have been successfully enrolled in this free course!",
        };
      } catch (error) {
        console.error("❌ Free course enrollment error:", error);
        return {
          status: "error",
          message: "Failed to enroll in the course.",
        };
      }
    }

    let stripeCustomerId: string | null = null;

    console.log("🔍 Checking user's Stripe customer ID...");
    const userWithStripeCustomerId = await prisma.user.findUnique({
      where: { id: user.id },
      select: { stripeCustomerId: true }
    });

    if (!userWithStripeCustomerId) {
      console.log("❌ User not found in database:", user.id);
      return {
        status: "error",
        message: "User not found.",
      };
    }

    console.log("👤 User stripe data:", {
      hasStripeCustomerId: !!userWithStripeCustomerId.stripeCustomerId,
      stripeCustomerId: userWithStripeCustomerId.stripeCustomerId,
    });

    // Enhanced customer verification
    if (userWithStripeCustomerId?.stripeCustomerId) {
      const savedCustomerId = userWithStripeCustomerId.stripeCustomerId;
      console.log("🔍 Verifying existing Stripe customer:", savedCustomerId);

      try {
        const existingCustomer = await stripe.customers.retrieve(savedCustomerId);

        if (existingCustomer.deleted) {
          console.log("⚠️ Stripe customer was deleted, will create new one");
          stripeCustomerId = null;
        } else {
          console.log("✅ Stripe customer verified:", {
            id: existingCustomer.id,
            email: existingCustomer.email,
            name: existingCustomer.name,
          });
          stripeCustomerId = savedCustomerId;
        }
      } catch (error) {
        console.log("❌ Stripe customer verification failed:", {
          customerId: savedCustomerId,
          error: error instanceof Error ? error.message : String(error),
        });
        stripeCustomerId = null; // Force creation of new customer
      }
    }

    // Create new customer if needed
    if (!stripeCustomerId) {
      console.log("🆕 Creating new Stripe customer...");
      try {
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.name,
          metadata: {
            userId: user.id,
          }
        });

        stripeCustomerId = customer.id;
        console.log("✅ New Stripe customer created:", {
          customerId: stripeCustomerId,
          email: customer.email,
          name: customer.name,
        });

        console.log("💾 Updating user with new Stripe customer ID...");
        await prisma.user.update({
          where: { id: user.id },
          data: { stripeCustomerId: stripeCustomerId }
        });
        console.log("✅ User updated with new Stripe customer ID");

      } catch (customerError) {
        console.error("❌ Failed to create Stripe customer:", customerError);
        return {
          status: "error",
          message: "Failed to create payment customer.",
        };
      }
    }

    console.log("🔄 Starting database transaction...");
    const result = await prisma.$transaction(async (tx) => {
      console.log("🔍 Checking for existing enrollment...");
      const existingEnrollment = await tx.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: user.id,
            courseId: course.id,
          }
        },
        select: {
          id: true,
          status: true,
        },
      });

      console.log("📋 Existing enrollment check:", {
        found: !!existingEnrollment,
        enrollmentId: existingEnrollment?.id,
        status: existingEnrollment?.status,
      });

      if (existingEnrollment?.status === "ACTIVE") {
        console.log("⚠️ User already enrolled with ACTIVE status");
        return {
          status: "error",
          message: "You are already enrolled in this course.",
        };
      }

      let enrollment;
      if (existingEnrollment) {
        console.log("🔄 Updating existing enrollment to PENDING...");
        enrollment = await tx.enrollment.update({
          where: { id: existingEnrollment.id },
          data: {
            status: "PENDING",
            amount: course.price, // Already in cents
          },
        });
        console.log("✅ Enrollment updated:", {
          id: enrollment.id,
          status: enrollment.status,
          amountInCents: enrollment.amount,
          amountInDollars: enrollment.amount / 100,
        });
      } else {
        console.log("🆕 Creating new enrollment...");
        enrollment = await tx.enrollment.create({
          data: {
            userId: user.id,
            courseId: course.id,
            status: "PENDING",
            amount: course.price, // Already in cents
          },
        });
        console.log("✅ New enrollment created:", {
          id: enrollment.id,
          userId: enrollment.userId,
          courseId: enrollment.courseId,
          status: enrollment.status,
          amountInCents: enrollment.amount,
          amountInDollars: enrollment.amount / 100,
        });
      }

      console.log("💳 Creating Stripe checkout session...");
      console.log("📝 Checkout session parameters:", {
        customer: stripeCustomerId,
        courseTitle: course.title,
        priceInCents: course.price, // No multiplication needed - already in cents
        metadata: {
          userId: user.id,
          courseId: course.id,
          enrollmentId: enrollment.id,
        },
      });

      const checkoutSession = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: course.title,
                description: `Access to ${course.title} course`,
              },
              unit_amount: course.price, // Already in cents - no conversion needed
            },
            quantity: 1,
          }
        ],
        mode: "payment",
        success_url: `${env.BETTER_AUTH_URL}/courses/${course.slug}/payment/success?session_id={CHECKOUT_SESSION_ID}&enrollmentId=${enrollment.id}`,
        cancel_url: `${env.BETTER_AUTH_URL}/courses/${course.slug}`,
        metadata: {
          userId: user.id,
          courseId: course.id,
          enrollmentId: enrollment.id,
        },
        payment_intent_data: {
          metadata: {
            userId: user.id,
            courseId: course.id,
            enrollmentId: enrollment.id,
          },
        },
      });

      console.log("✅ Stripe checkout session created:", {
        sessionId: checkoutSession.id,
        url: checkoutSession.url,
        metadata: checkoutSession.metadata,
        customer: checkoutSession.customer,
        amount_total: checkoutSession.amount_total,
      });

      return {
        enrollment: enrollment,
        checkoutUrl: checkoutSession.url,
      };
    });

    console.log("✅ Transaction completed successfully");
    checkoutUrl = result.checkoutUrl as string;

    console.log("🚀 Redirecting to checkout:", {
      checkoutUrl,
      enrollmentId: result.enrollment?.id,
    });

  } catch (error) {
    console.error("❌ ENROLLMENT ERROR:", {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      courseId,
      timestamp: new Date().toISOString(),
    });

    if (error instanceof Stripe.errors.StripeError) {
      console.error("💳 Stripe Error Details:", {
        type: error.type,
        code: error.code,
        message: error.message,
        statusCode: error.statusCode,
      });
      return {
        status: "error",
        message: error.message,
      };
    }
    return {
      status: "error",
      message: "Failed to enroll in the course.",
    };
  }

  console.log("🎯 About to redirect to Stripe checkout...");
  redirect(checkoutUrl);
}