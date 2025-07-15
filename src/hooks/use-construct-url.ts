import { env } from "@/env";

export function useConstructUrl(key: string) {
    if (!key) return undefined;

    // Construct the URL using the key
    return `https://${env.NEXT_PUBLIC_S3_BUCKET_NAME}.fly.storage.tigris.dev/${key}`;
}