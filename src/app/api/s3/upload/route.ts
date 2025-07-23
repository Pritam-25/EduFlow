import { NextResponse } from "next/server";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from 'uuid';
import { s3Client } from "@/lib/s3-client";
import { uploadSchema } from "@/lib/zodSchema";
import { ajProtect } from "@/lib/arcjet-protect";
import { requireUser } from "@/lib/require_user";



export async function POST(request: Request) {

    const session = await requireUser();

    try {
        const decision = await ajProtect.protect(request, {
            fingerprint: session?.user.id as string || "anonymous",
        });

        if(decision.isDenied()){
            return NextResponse.json({
                error: "Upload limit exceeded or bot detected, try again later.",
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

        const { fileName, contentType } = validatedData.data;

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
        console.error("Error generating presigned URL:", error);
        return NextResponse.json({
            error: "Failed to generate presigned URL",
        }, { status: 500 });
    }
}