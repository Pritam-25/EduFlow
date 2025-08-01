import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";
import { Role } from "@/generated/prisma";
import { env } from "@/env";

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
            clientId: "",
            clientSecret: ""
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
    emailAndPassword: {
        enabled: true,
    },
});