"use client";

import { ThemeToggle } from "@/components/ThemeToggle";
import { Menu, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { ConfirmSignOutModal } from "./ConfirmSignOutModal";
import { DesktopMenu } from "./DesktopMenu";
import { MobileMenu } from "./MobileMenu";
import { TopLeft } from "./TopLeft";

export const Topbar = () => {
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isConfirmingSignOutOpen, setIsConfirmingSignOutOpen] = useState(false);

  const handleSignOut = () => {
    setIsConfirmingSignOutOpen(true);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="gym-bar sticky top-0 z-50 h-[72px]">
        <div className="flex h-[69px] items-center justify-between gap-4 px-3 md:px-6">
          <TopLeft session={session} closeMobileMenu={closeMobileMenu} />

          <div className="flex items-center gap-1">
            <ThemeToggle />
            <DesktopMenu
              session={session}
              status={status}
              handleSignOut={handleSignOut}
            />

            <div className="ml-4 border-l border-current/25 pl-4 md:hidden">
              <button
                type="button"
                onClick={toggleMobileMenu}
                aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
                aria-expanded={isMobileMenuOpen}
                className="flex h-10 w-10 cursor-pointer items-center justify-center text-current"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
        <div className="h-[3px] bg-tape" />
      </header>
      <ConfirmSignOutModal
        isOpen={isConfirmingSignOutOpen}
        onClose={() => setIsConfirmingSignOutOpen(false)}
        onSignOut={() => {
          signOut({ callbackUrl: "/" });
          setIsConfirmingSignOutOpen(false);
        }}
      />

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
        session={session}
        status={status}
        onSignOut={handleSignOut}
      />
    </>
  );
};
