import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
    server: {
        DATABASE_URL: z.string().url(),
        BETTER_AUTH_SECRET: z.string().min(1),
        BETTER_AUTH_URL: z.string().min(1),
        AUTH_GITHUB_CLIENT_ID: z.string().min(1),
        AUTH_GITHUB_SECRET: z.string().min(1)
    },

    runtimeEnv: process.env,
    emptyStringAsUndefined: true,
});