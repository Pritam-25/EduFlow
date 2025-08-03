import { env } from "@/env";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import Stripe from "stripe";

export async function POST(req: Request) {
  console.log("🎯 WEBHOOK ENDPOINT HIT!", new Date().toISOString());

  const body = await req.text();
  console.log("📦 Webhook body length:", body.length);

  const headerList = await headers();
  const signature = headerList.get("Stripe-Signature");

  console.log("🔑 Stripe signature present:", !!signature);
  console.log("🔒 Webhook secret configured:", !!env.STRIPE_WEBHOOK_SECRET);

  if (!signature) {
    console.error("❌ Missing Stripe signature");
    return new Response("Missing Stripe signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET as string
    );
    console.log("✅ Webhook signature verified successfully");
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err);
    return new Response("Webhook Error", { status: 400 });
  }

  console.log("📧 Webhook event received:", event.type);
  console.log("📧 Event ID:", event.id);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    console.log("💳 Processing checkout session:", {
      sessionId: session.id,
      customerId: session.customer,
      metadata: session.metadata,
      amount_total: session.amount_total,
      payment_status: session.payment_status,
    });

    const courseId = session.metadata?.courseId;
    const enrollmentId = session.metadata?.enrollmentId;
    const userId = session.metadata?.userId;
    const customerId = session.customer as string;

    console.log("🔍 Extracted data:", {
      courseId,
      enrollmentId,
      userId,
      customerId,
    });

    // Validate all required fields
    if (!courseId || !customerId || !enrollmentId) {
      console.error("❌ Missing required data:", {
        courseId,
        customerId,
        enrollmentId,
        userId
      });
      return new Response("Missing required data in session metadata", { status: 400 });
    }

    try {
      console.log("🔍 Looking for user with Stripe customer ID:", customerId);

      // Find user by Stripe customer ID
      const user = await prisma.user.findUnique({
        where: { stripeCustomerId: customerId },
      });

      if (!user) {
        console.error("❌ User not found for customerId:", customerId);

        // Try to find user by email as fallback
        console.log("🔍 Trying to find user by email...");
        const stripeCustomer = await stripe.customers.retrieve(customerId);

        if (stripeCustomer && !stripeCustomer.deleted && stripeCustomer.email) {
          const userByEmail = await prisma.user.findUnique({
            where: { email: stripeCustomer.email },
          });

          if (userByEmail) {
            console.log("✅ Found user by email, updating with Stripe customer ID");
            await prisma.user.update({
              where: { id: userByEmail.id },
              data: { stripeCustomerId: customerId },
            });

            // Continue with this user
            const updatedUser = userByEmail;
            await updateEnrollment(updatedUser, enrollmentId, courseId, session);
            return new Response("Webhook processed successfully", { status: 200 });
          }
        }

        return new Response("User not found", { status: 404 });
      }

      console.log("✅ User found:", { userId: user.id, email: user.email });
      await updateEnrollment(user, enrollmentId, courseId, session);

    } catch (error) {
      console.error("❌ Database error:", error);
      return new Response("Database error", { status: 500 });
    }
  }

  console.log("✅ Webhook processed successfully");
  return new Response("Webhook received", { status: 200 });
}

async function updateEnrollment(user: { id: string; email: string }, enrollmentId: string, courseId: string, session: Stripe.Checkout.Session) {
  console.log("🔄 Starting enrollment update...");

  // Check if enrollment exists
  const existingEnrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
  });

  if (!existingEnrollment) {
    console.error("❌ Enrollment not found:", enrollmentId);
    throw new Error("Enrollment not found");
  }

  console.log("📝 Found enrollment:", {
    id: existingEnrollment.id,
    status: existingEnrollment.status,
    userId: existingEnrollment.userId,
    courseId: existingEnrollment.courseId,
  });

  // Update enrollment to ACTIVE
  const updatedEnrollment = await prisma.enrollment.update({
    where: { id: enrollmentId },
    data: {
      userId: user.id,
      courseId: courseId,
      amount: (session.amount_total ?? 0) / 100,
      status: "ACTIVE",
    },
  });

  console.log("✅ Enrollment updated successfully:", {
    enrollmentId: updatedEnrollment.id,
    userId: updatedEnrollment.userId,
    courseId: updatedEnrollment.courseId,
    status: updatedEnrollment.status,
    amount: updatedEnrollment.amount,
  });
}