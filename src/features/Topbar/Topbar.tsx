"use client";

import { Button } from "@/components/ui/button";
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
      {/* Main Topbar */}
      <div className="flex sticky top-0 justify-between items-center bg-background border-b border-border p-2 z-50 h-[72px]">
        <TopLeft session={session} closeMobileMenu={closeMobileMenu} />

        {/* Desktop Navigation */}
        <DesktopMenu session={session} status={status} handleSignOut={handleSignOut} />

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMobileMenu}
            className="p-2"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
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
