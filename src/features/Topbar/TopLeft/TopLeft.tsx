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
      className="flex items-center gap-3 group"
    >
      {hasCustomBranding ? (
        <>
          {/* Custom Gym Logo */}
          <div className="relative w-14 h-14 rounded-full overflow-hidden bg-muted flex-shrink-0 border-2 border-border transition-colors">
            <Image
              src={session.user.avatar_url!}
              alt={session.user.gym_name!}
              fill
              className="object-cover"
              sizes="100px"
              priority
            />
          </div>
          <div className="flex flex-col items-start justify-center relative">
            <h1 className="text-2xl font-bold leading-none mb-0.5">
              {session.user.gym_name}
            </h1>
            <span className="text-[8px] text-muted-foreground font-medium leading-none -mt-1">
              by FORZA
            </span>
          </div>
        </>
      ) : (
        <>
          {/* Default Forza Logo */}
          <div className="relative w-14 h-14 rounded-full overflow-hidden bg-muted flex-shrink-0 border-2 border-border transition-colors">
            <Image
              src={"/forza-logo.png"}
              alt="Forza Logo"
              fill
              className="object-cover"
              sizes="100px"
              priority
            />
          </div>
          <div className="flex flex-col items-start justify-center relative">
            <h1 className="text-2xl font-bold leading-none mb-0.5">Forza</h1>
          </div>
        </>
      )}
    </Link>
  );
};
