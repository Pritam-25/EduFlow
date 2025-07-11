import { NextResponse } from "next/server";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { z } from "zod";

import { v4 as uuidv4 } from 'uuid';
import { s3Client } from "@/lib/s3-client";
import { aj, detectBot, fixedWindow } from "@/lib/arcjet";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { User } from "lucide-react";

export const uploadSchema = z.object({
    fileName: z.string().min(1, "File name is required"),
    size: z.number().max(5 * 1024 * 1024, "File size must be less than 5MB"),
    contentType: z.string().min(1, "Content type is required"),
    isImage: z.boolean().optional(),
});

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

export async function POST(request: Request) {

    const session = await auth.api.getSession({ headers: await headers() });

    try {

        const decision = await arcjet.protect(request, {
            fingerprint: session?.user.id as string || "anonymous",
        });

        if(decision.isDenied()){
            return NextResponse.json({
                error: "Upload limit exceeded or bot detected",
            }, { status: 429 });
        }

        const body = await request.json();

        const validatedData = uploadSchema.safeParse(body);
        if (!validatedData.success) {
            return NextResponse.json({
                error: "Invalid request body",
                details: validatedData.error.errors,
            }, { status: 400 });
        }

        const { fileName, contentType, isImage, } = validatedData.data;

        const uniqueFileKey = `${Date.now()}-${uuidv4()}-${fileName}`;
        const command = new PutObjectCommand({
            Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
            Key: uniqueFileKey,
            ContentType: contentType,
        });

        const presignedUrl = await getSignedUrl(
            s3Client,
            command,
            { expiresIn: 3600 } // URL valid for 1 hour 
        );

        const responseData = {
            presignedUrl,
            key: uniqueFileKey,
        };

        return NextResponse.json(responseData);

    } catch (error) {
        return NextResponse.json({
            error: "Failed to generate presigned URL",
        }, { status: 500 });
    }
}