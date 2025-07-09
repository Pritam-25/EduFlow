import { s3Client } from "@/lib/s3-client";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
    try {
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