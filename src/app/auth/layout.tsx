import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/");
  }

  return (
    <div className="gym-floor flex min-h-[calc(100vh-72px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">{children}</div>
    </div>
  );
}
