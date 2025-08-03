"use server"

import { ajProtect } from "@/lib/arcjet-protect";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/require_user";
import { ApiResponse } from "@/lib/types";
import { CourseSchema, CourseSchemaType } from "@/lib/zodSchema"
import { request } from "@arcjet/next";
import { stripe } from "@/lib/stripe";


export async function adminCreateCourse(FormData: CourseSchemaType): Promise<ApiResponse> {
    let user = null;

    console.log("🚀 COURSE CREATION STARTED", {
        title: FormData.title,
        price: FormData.price,
        timestamp: new Date().toISOString(),
    });

    try {
        console.log("🔐 Getting user session...");
        const session = await requireUser();
        user = session?.user;

        if (!session || !session.user?.id) {
            console.log("❌ User not authenticated");
            return {
                status: "error",
                message: "User must be authenticated to create a course",
            };
        }

        console.log("✅ User session retrieved:", {
            userId: user.id,
            email: user.email,
            name: user.name,
        });

        console.log("🛡️ Checking Arcjet protection...");
        const req = await request();
        const decision = await ajProtect.protect(req, {
            fingerprint: session?.user?.id || "anonymous",
        });

        if (decision.isDenied()) {
            console.log("🚫 Arcjet denied request:", decision.reason);
            if (decision.reason.isRateLimit()) {
                return {
                    status: "error",
                    message: "You have been blocked due to rate limiting. Please try again later.",
                };
            } else {
                return {
                    status: "error",
                    message: "Too many requests, please try again later.",
                };
            }
        }
        console.log("✅ Arcjet protection passed");

        // Validate the form data using Zod schema
        console.log("📋 Validating form data...");
        const validation = CourseSchema.safeParse(FormData);
        if (!validation.success) {
            console.log("❌ Validation failed:", validation.error.errors);
            return {
                status: "error",
                message: validation.error.errors[0]?.message || "Invalid form data"
            };
        }

        const validatedData = validation.data;
        console.log("✅ Form data validated:", {
            title: validatedData.title,
            slug: validatedData.slug,
            price: validatedData.price,
        });

        // Check if course with same slug already exists
        console.log("🔍 Checking for existing course with slug:", validatedData.slug);
        const existingCourse = await prisma.course.findUnique({
            where: { slug: validatedData.slug },
            select: { id: true, title: true }
        });

        if (existingCourse) {
            console.log("❌ Course with slug already exists:", existingCourse);
            return {
                status: "error",
                message: "A course with this URL slug already exists. Please choose a different one."
            };
        }

        let stripeProductId: string | null = null;
        let stripePriceId: string | null = null;

        // Only create Stripe product if course has a price > 0
        if (validatedData.price > 0) {
            console.log("💳 Creating Stripe product for paid course...");
            const stripeProduct = await stripe.products.create({
                name: validatedData.title,
                description: validatedData.smallDescription || `Access to ${validatedData.title} course`,
                metadata: {
                    courseAuthor: session.user.id,
                    courseSlug: validatedData.slug,
                    createdAt: new Date().toISOString(),
                },
                default_price_data: {
                    currency: "usd",
                    unit_amount: Math.round(validatedData.price * 100), // Convert to cents
                }
            });

            stripeProductId = stripeProduct.id;
            stripePriceId = stripeProduct.default_price as string;

            console.log("✅ Stripe product created:", {
                productId: stripeProductId,
                priceId: stripePriceId,
                name: stripeProduct.name,
                amount: Math.round(validatedData.price * 100),
            });

            // Verify that default_price was created
            if (!stripePriceId) {
                console.log("❌ Stripe product creation failed - no default price");
                return {
                    status: "error",
                    message: "Failed to create course pricing. Please try again."
                };
            }
        } else {
            console.log("🆓 Creating free course - no Stripe product needed");
        }

        console.log("💾 Creating course in database...");
        const course = await prisma.course.create({
            data: {
                ...validatedData,
                authorId: session.user.id,
                stripeProductId: stripeProductId,
                stripePriceId: stripePriceId,
            }
        });

        console.log("✅ Course created successfully:", {
            courseId: course.id,
            title: course.title,
            slug: course.slug,
            price: course.price,
            stripeProductId: course.stripeProductId,
            stripePriceId: course.stripePriceId,
            authorId: course.authorId,
        });

        return {
            status: "success",
            message: `Course "${course.title}" created successfully!`
        };

    } catch (error) {
        console.error("❌ COURSE CREATION ERROR:", {
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined,
            formData: {
                title: FormData.title,
                slug: FormData.slug,
                price: FormData.price,
            },
            userId: user?.id,
            timestamp: new Date().toISOString(),
        });

        // Handle specific Stripe errors
        if (error instanceof Error) {
            // Stripe-related errors
            if (error.message.includes('stripe') || error.message.includes('Stripe')) {
                console.error("💳 Stripe-specific error:", error.message);
                return {
                    status: "error",
                    message: "Failed to set up course payment system. Please try again."
                };
            }

            // Database constraint errors
            if (error.message.includes('Unique constraint')) {
                return {
                    status: "error",
                    message: "A course with this information already exists."
                };
            }

            // General error with specific message
            return {
                status: "error",
                message: error.message.includes('validation')
                    ? "Please check your form data and try again."
                    : "Failed to create course. Please try again."
            };
        }

        return {
            status: "error",
            message: "An unexpected error occurred. Please try again."
        };
    }
}