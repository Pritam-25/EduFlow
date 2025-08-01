import { ajProtect } from "@/lib/arcjet-protect";
import { requireUser } from "@/lib/require_user";
import { s3Client } from "@/lib/s3-client";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";


export async function DELETE(request: Request) {
    const session = await requireUser();

    try {

        // Protect the request using Arcjet
        const decision = await ajProtect.protect(request, {
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
        console.error("Error deleting file:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }

}