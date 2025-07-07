import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db"
import { env } from "@/env";
import { emailOTP } from "better-auth/plugins"
import { resend } from "./resend";
import { Role } from "@/generated/prisma";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "sqlite", // or "mysql", "postgresql", ...etc
    }),
    socialProviders: {
        github: {
            clientId: env.AUTH_GITHUB_CLIENT_ID,
            clientSecret: env.AUTH_GITHUB_SECRET
        },
        google: {
            clientId: "",
            clientSecret: ""
        }
    },
    user: {
        additionalFields: {
            role: {
                type: [Role.USER, Role.ADMIN],
            }
        }
    },
    plugins: [
        emailOTP({
            async sendVerificationOTP({ email, otp }) {
                await resend.emails.send({
                    from: 'Acme <onboarding@resend.dev>',
                    to: [email],
                    subject: 'LMS Platform - Verification Code',
                    html: `<p>Hi, your verification code is <strong>${otp}</strong></p>`,
                });
            }
        })
    ]
})