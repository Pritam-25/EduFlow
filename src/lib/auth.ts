import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";
import { emailOTP } from "better-auth/plugins";
import { Role } from "@/generated/prisma";
import { env } from "@/env";
import { sendVerificationEmailAction } from "./email-action";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    socialProviders: {
        github: {
            clientId: env.AUTH_GITHUB_CLIENT_ID,
            clientSecret: env.AUTH_GITHUB_SECRET,
        },
        google: {
            clientId: env.AUTH_GOOGLE_CLIENT_ID,
            clientSecret: env.AUTH_GOOGLE_SECRET
        }
    },
    user: {
        additionalFields: {
            role: {
                type: [Role.USER, Role.ADMIN, Role.CREATOR],
                defaultValue: Role.USER,
                input: false,
                returned: true,
            }
        }
    },
    plugins: [
        emailOTP({
            async sendVerificationOTP({ email, otp }) {
                 // Use server action instead of fetch
                await sendVerificationEmailAction(email, otp);
            }
        })
    ],
});