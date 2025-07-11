import arcjet, { detectBot, protectSignup, sensitiveInfo, shield, slidingWindow, fixedWindow } from "@arcjet/next";

export { detectBot, protectSignup, sensitiveInfo, shield, slidingWindow, fixedWindow };

export const aj = arcjet({
    key: process.env.ARCJET_KEY!,
    characteristics: ["fingerprint"],

    // This is the default mode, can also be empty if you don't want to set a default
    rules: [
        // This rule is live
        shield({
            mode: "LIVE",
        }),
    ],
});