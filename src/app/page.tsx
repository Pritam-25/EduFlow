"use client";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/themeToggle";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Home() {
  // get user session
  const { data: session } = authClient.useSession();
  // we make this client component because authclient only work on client component

  const router = useRouter()

  async function handleLogOut() {
    try {
      await authClient.signOut({
        fetchOptions:{
          onSuccess: () => {
            router.push("/");
            toast.success("Successfully logged out");
          },
          onError: (error) => {
            console.error("Logout error:", error);
          },
        }
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
      <ThemeToggle />
      {session ? (
        <>
          <p>{session.user.name}</p>
          <Button onClick={handleLogOut}>Logout</Button>
        </>
      ) : (
        <>
          <Button>Login</Button>
        </>
      )}
    </div>
  );
}
