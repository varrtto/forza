"use client";

import { Spinner } from "@/components/ui/spinner";
import { Session } from "next-auth";
import Link from "next/link";
import { usePathname } from "next/navigation";

const linkClass = (active: boolean) =>
  `font-display text-lg tracking-wide transition-colors ${
    active ? "text-tape" : "text-current/75 hover:text-tape"
  }`;

function isExercisesPath(pathname: string) {
  return pathname === "/exercises" || pathname === "/add-excercise";
}

export const DesktopMenu = ({
  session,
  status,
  handleSignOut,
}: {
  session: Session | null;
  status: "loading" | "authenticated" | "unauthenticated";
  handleSignOut: () => void;
}) => {
  const pathname = usePathname();

  return (
    <nav className="ml-8 hidden items-center border-l border-current/25 pl-8 md:flex">
      {status === "loading" ? (
        <Spinner />
      ) : session ? (
        <>
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className={linkClass(pathname === "/dashboard")}
            >
              Alumnos
            </Link>
            <Link
              href="/exercises"
              className={linkClass(isExercisesPath(pathname))}
            >
              Ejercicios
            </Link>
            <Link href="/profile" className={linkClass(pathname === "/profile")}>
              {session.user?.name || "Perfil"}
            </Link>
          </div>
          <div className="ml-8 border-l border-current/25 pl-8">
            <button
              type="button"
              onClick={handleSignOut}
              className="cursor-pointer font-display text-lg tracking-wide text-current/45 hover:text-tape"
            >
              Salir
            </button>
          </div>
        </>
      ) : (
        <div className="flex items-center gap-6">
          <Link
            href="/auth/signin"
            className={linkClass(pathname === "/auth/signin")}
          >
            Iniciar sesión
          </Link>
          <Link
            href="/auth/signup"
            className="bg-tape px-3 py-2 font-display text-lg text-on-tape"
          >
            Registrarse
          </Link>
        </div>
      )}
    </nav>
  );
};
