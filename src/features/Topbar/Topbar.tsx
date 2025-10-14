"use client";

import { ButtonLink } from "@/components/ui/ButtonLink";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, User, UserPlus, Users, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { MobileMenu } from "./MobileMenu";

export const Topbar = () => {
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  return (
    <>
      {/* Main Topbar */}
      <div className="flex sticky top-0 justify-between items-center bg-background border-b border-border p-4 z-50">
        <Link href="/" onClick={closeMobileMenu}>
          <h1 className="text-2xl font-bold">Forza</h1>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          {status === "loading" ? (
            <div className="text-sm text-muted-foreground">Cargando...</div>
          ) : session ? (
            <>
              <ButtonLink href="/" variant="link">
                <span className="flex items-center gap-2">
                  Lista de Alumnos
                  <Users className="h-4 w-4" />
                </span>
              </ButtonLink>
              <ButtonLink href="/add-student" variant="link">
                <span className="flex items-center gap-2">
                  Agregar alumno
                  <UserPlus className="h-4 w-4" />
                </span>
              </ButtonLink>

              <div className="flex items-center gap-2 ml-4 pl-4 border-l border-border">
                <span className="flex items-center gap-1 text-sm">
                  <User className="h-4 w-4" />
                  {session.user?.name || session.user?.email}
                </span>
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
