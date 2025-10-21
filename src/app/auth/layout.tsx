import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Redirect to home if already authenticated
  if (session) {
    redirect("/");
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-72px)] items-center justify-center bg-gray-50 px-4">
      {children}
    </div>
  );
}
