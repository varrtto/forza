"use client";

import { Session } from "next-auth";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  session: Session | null;
  status: "loading" | "authenticated" | "unauthenticated";
  onSignOut: () => void;
}

const itemClass = (active: boolean) =>
  `block font-display text-4xl leading-none tracking-tight ${
    active ? "text-tape" : "text-ink"
  }`;

function isExercisesPath(pathname: string) {
  return pathname === "/exercises" || pathname === "/add-excercise";
}

export const MobileMenu = ({
  isOpen,
  onClose,
  session,
  status,
  onSignOut,
}: MobileMenuProps) => {
  const pathname = usePathname();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-ink/70 md:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`gym-floor fixed inset-x-0 top-[72px] z-50 h-[calc(100dvh-72px)] overflow-y-auto transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <nav className="flex flex-col gap-8 px-6 py-10">
          {status === "loading" ? (
            <p className="font-display text-2xl text-ink/50">Cargando</p>
          ) : session ? (
            <>
              <Link
                href="/dashboard"
                onClick={onClose}
                className={itemClass(pathname === "/dashboard")}
              >
                Alumnos
              </Link>
              <Link
                href="/exercises"
                onClick={onClose}
                className={itemClass(isExercisesPath(pathname))}
              >
                Ejercicios
              </Link>
              <Link
                href="/profile"
                onClick={onClose}
                className={itemClass(pathname === "/profile")}
              >
                {session.user?.name || "Perfil"}
              </Link>
              <div className="border-t border-ink/15 pt-8">
                <button
                  type="button"
                  onClick={onSignOut}
                  className="cursor-pointer text-left font-display text-2xl text-ink/45"
                >
                  Salir
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/auth/signin"
                onClick={onClose}
                className={itemClass(pathname === "/auth/signin")}
              >
                Iniciar sesión
              </Link>
              <Link
                href="/auth/signup"
                onClick={onClose}
                className="inline-flex w-fit bg-tape px-4 py-3 font-display text-xl text-on-tape"
              >
                Registrarse
              </Link>
            </>
          )}
        </nav>
      </div>
    </>
  );
};
