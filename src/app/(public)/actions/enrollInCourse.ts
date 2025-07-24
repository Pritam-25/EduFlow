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
  
  try {
    const session = await requireUser();
    const user = session.user;


    
    const req = await request()
    const decision = await ajProtect.protect(req,{
      fingerprint: user.id,
    })


    if(decision.isDenied()){
      return {
        status: "error",
        message: "You have been blocked.",
      }
    }

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        price: true,
      }
    })

    if (!course) {
      return {
        status: "error",
        message: "Course not found.",
      }
    }


    let stripeCustomerId: string | null = null;

    const userWithStripCustomerId = await prisma.user.findUnique({
      where: { id: user.id },
      select: { stripCustomerId: true }
    })

    if (!userWithStripCustomerId) {
      return {
        status: "error",
        message: "User not found.",
      }
    }

    if (userWithStripCustomerId?.stripCustomerId) {
      stripeCustomerId = userWithStripCustomerId.stripCustomerId;
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          userId: user.id,
          courseId: course.id,
        }
      })

      stripeCustomerId = customer.id;

      // update user with new stripe customer ID
      await prisma.user.update({
        where: { id: user.id },
        data: { stripCustomerId: stripeCustomerId }
      })
    }

    const result = await prisma.$transaction(async (tx) => {

      const existingEnrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: user.id,
            courseId: course.id,
          }
        },
        select: {
          id: true,
          status: true,
          course: {
            select: {
              id: true,
              title: true,
              slug: true,
              price: true,
            }
          }
        },
      })

      if (existingEnrollment?.status === "ACTIVE") {
        return {
          status: "error",
          message: "You are already enrolled in this course.",
        }
      }

      let enrollment;
      if (existingEnrollment) {
        enrollment = await tx.enrollment.update({
          where: { id: existingEnrollment.id },
          data: {
            status: "PENDING",
            amount: course.price || 0,
          },
        })
      } else {
        enrollment = await tx.enrollment.create({
          data: {
            userId: user.id,
            courseId: course.id,
            status: "PENDING",
            amount: course.price || 0,
          },
        })
      }


      const checkoutSession = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        // payment_method_types: ["card"],
        // mode: "payment",
        line_items: [
          {
            price: "price_1RoI6qCXErhOvIgkjZQYtg0K",
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${env.BETTER_AUTH_URL}/courses/${course.slug}/payment/success?enrollmentId=${enrollment.id}`,
        cancel_url: `${env.BETTER_AUTH_URL}/courses/${course.slug}/payment/cancel`,
        metadata: {
          userId: user.id,
          courseId: course.id,
          enrollmentId: enrollment.id,
        },
      })

      return {
        enrollment: enrollment,
        checkoutUrl: checkoutSession.url,
      }

    })


    checkoutUrl = result.checkoutUrl as string;;



  } catch (error) {
    if (error instanceof Stripe.errors.StripeError) {
      return {
        status: "error",
        message: error.message,
      }
    }
    return {
      status: "error",
      message: "Failed to enroll in the course.",
    }
  }

  redirect(checkoutUrl);
   
}