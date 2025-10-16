"use client";

import { ButtonLink } from "@/components/ui/ButtonLink";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, Settings, UserPlus, Users, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MobileMenu } from "./MobileMenu";

export const Topbar = () => {
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const handleSignOut = () => {
    signOut({ callbackUrl: "/auth/signin" });
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Wait for client-side mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const hasCustomBranding =
    mounted && session?.user?.avatar_url && session?.user?.gym_name;

  return (
    <>
      {/* Main Topbar */}
      <div className="flex sticky top-0 justify-between items-center bg-background border-b border-border p-2 z-50">
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
                  de FORZA
                </span>
              </div>
            </>
          ) : (
            <h1 className="text-2xl font-bold">Forza</h1>
          )}
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          {status === "loading" ? (
            <div className="text-sm text-muted-foreground">Cargando...</div>
          ) : session ? (
            <>
              <ButtonLink href="/dashboard" variant="link">
                <span className="flex items-center gap-2">
                  Dashboard
                  <Users className="h-4 w-4" />
                </span>
              </ButtonLink>
              <ButtonLink href="/add-student" variant="link">
                <span className="flex items-center gap-2">
                  Agregar Alumno
                  <UserPlus className="h-4 w-4" />
                </span>
              </ButtonLink>

              <div className="flex items-center gap-2 pl-4 border-l border-border">
                <ButtonLink href="/profile" variant="link">
                  {session.user?.name || session.user?.email}
                  <Settings className="h-4 w-4" />
                </ButtonLink>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <ButtonLink href="/auth/signin" variant="link">
                Iniciar Sesión
              </ButtonLink>
              <ButtonLink href="/auth/signup" variant="default">
                Registrarse
              </ButtonLink>
            </div>
          )}
        </div>

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
