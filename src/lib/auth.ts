import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db"
import { emailOTP } from "better-auth/plugins"
import { resend } from "./resend";
import { Role } from "@/generated/prisma";
import { env } from "@/env";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // your database provider
    }),
    // socialProviders: {
    //     github: {
    //         clientId: env.AUTH_GITHUB_CLIENT_ID,
    //         clientSecret: env.AUTH_GITHUB_SECRET,
    //     },
    //     google: {
    //         clientId: "",
    //         clientSecret: ""
    //     }
    // },
    user: {
        additionalFields: {
            role: {
                type: [Role.USER, Role.ADMIN],
                defaultValue: Role.USER, // default role is USER
                input: true, // allow user to set role - false with hide this field,
                returned: true, // return this field in the user object
            }
        }
    },
    plugins: [
        emailOTP({
            async sendVerificationOTP({ email, otp }) {

                await resend.emails.send({
                    from: 'EduFlow <onboarding@resend.dev>',
                    to: [email],
                    subject: 'EduFlow LMS - Verification Code',
                    html: `<p>Hi, your verification code is <strong>${otp}</strong></p>`,
                });
            }
        })
    ],
    // ✅ Fix: Add Vercel domain to trusted origins
    trustedOrigins: [
        "http://localhost:3000",
        "https://edu-flow-six.vercel.app", // Add your Vercel domain
    ],
    // ✅ Fix: Set baseURL for production
    baseURL: env.BETTER_AUTH_URL || "http://localhost:3000",
    // ✅ Fix: Set secret for production
    secret: env.BETTER_AUTH_SECRET,
})