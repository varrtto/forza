"use client";

import { Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export const TopLeft = ({
  session,
  closeMobileMenu,
}: {
  session: Session | null;
  closeMobileMenu: () => void;
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const hasCustomBranding =
    mounted && session?.user?.avatar_url && session?.user?.gym_name;

  return (
    <Link
      href="/"
      onClick={closeMobileMenu}
      className="flex min-w-0 items-center gap-3"
    >
      {hasCustomBranding ? (
        <>
          <div className="relative h-12 w-12 shrink-0 overflow-hidden bg-floor">
            <Image
              src={session.user.avatar_url!}
              alt={session.user.gym_name!}
              fill
              className="object-cover"
              sizes="48px"
              priority
            />
          </div>
          <div className="min-w-0">
            <p className="truncate font-display text-xl leading-none tracking-tight">
              {session.user.gym_name}
            </p>
            <p className="mt-1 text-[11px] leading-none text-current/55">
              Forza
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="relative h-12 w-12 shrink-0 overflow-hidden bg-floor">
            <Image
              src="/forza-logo.png"
              alt="Forza"
              fill
              className="object-cover"
              sizes="48px"
              priority
            />
          </div>
          <p className="font-display text-xl leading-none tracking-tight">
            Forza
          </p>
        </>
      )}
    </Link>
  );
};
