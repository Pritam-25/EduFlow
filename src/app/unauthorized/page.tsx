"use client";

import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center  text-foreground px-4">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <h1 className="text-5xl font-bold border-r pr-4 border-white">403</h1>
        <div className="text-center sm:text-left">
          <p className="text-lg">Only admins can access this page.</p>
          <button
            onClick={() => router.back()}
            className="mt-2 text-sm text-muted-foreground bg-accent px-2 py-1 rounded-2xl hover:text-secondary-foreground transition-colors"
          >
            ← Go back
          </button>
        </div>
      </div>
    </div>
  );
}
