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
    socialProviders: {
        github: {
            clientId: env.AUTH_GITHUB_CLIENT_ID,
            clientSecret: env.AUTH_GITHUB_SECRET,
        },
        google: {
            clientId: "",
            clientSecret: ""
        }
    },
    user: {
        additionalFields: {
            role: {
                type: [Role.USER, Role.ADMIN, Role.CREATOR],
                defaultValue: Role.USER, // default role is USER
                input: false, // hide this field from user input
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
})