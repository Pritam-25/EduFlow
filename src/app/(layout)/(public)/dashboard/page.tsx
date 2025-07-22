import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/login");

  if (session.user.role === "ADMIN") {
    redirect("/admin/dashboard");
  } else {
    return (
      <div>
        <h1 className="text-2xl font-bold"> Hello from Student dashboard</h1>
      </div>
    );
  }
}
