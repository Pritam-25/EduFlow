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
    ]
})