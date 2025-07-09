import { NextResponse } from "next/server";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { z } from "zod";

import { v4 as uuidv4 } from 'uuid';
import { s3Client } from "@/lib/s3-client";

export const uploadSchema = z.object({
    fileName: z.string().min(1, "File name is required"),
    size: z.number().max(5 * 1024 * 1024, "File size must be less than 5MB"),
    contentType: z.string().min(1, "Content type is required"),
    isImage: z.boolean().optional(),
});

export async function POST(request: Request) {
    try {
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