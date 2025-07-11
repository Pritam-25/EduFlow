import { aj, detectBot, fixedWindow } from "@/lib/arcjet";
import { auth } from "@/lib/auth";
import { s3Client } from "@/lib/s3-client";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { headers } from "next/headers";
import { NextResponse } from "next/server";


// implement arcjet for upload protection
const arcjet = aj.withRule(
    detectBot({
        mode: "LIVE",
        allow: [], // no bots allowed for uploads
    })
).withRule(
    fixedWindow({
        mode: "LIVE",
        window: "1m", // 1 minute window
        max: 10, // max 10 uploads per window
    })
);

export async function DELETE(request: Request) {
    const session = await auth.api.getSession({ headers: await headers() });

    try {

        // Protect the request using Arcjet
        const decision = await arcjet.protect(request, {
            fingerprint: session?.user.id as string || "anonymous",
        });

        // Check if the request is denied
        if (decision.isDenied()) {
            return NextResponse.json({
                error: "Delete limit exceeded or bot detected",
            }, { status: 429 });
        }

        if (!process.env.NEXT_PUBLIC_S3_BUCKET_NAME) {
            throw new Error("S3 bucket name is not defined in environment variables");
        }

        const body = await request.json();
        const { key } = body;
        if (!key) {
            return new Response("Missing or invalid object key", { status: 400 });
        }

        const command = new DeleteObjectCommand({
            Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
            Key: key,
        });

        await s3Client.send(command);

        return NextResponse.json(
            { message: "File deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }

}