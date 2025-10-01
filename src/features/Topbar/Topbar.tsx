"use client";

import { ButtonLink } from "@/components/ui/ButtonLink";
import { Button } from "@/components/ui/button";
import { ListCheck, LogOut, Menu, User, UserPlus, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

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

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-background border-l border-border shadow-lg transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold">Menú</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeMobileMenu}
              className="p-2"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile Menu Content */}
          <div className="space-y-4">
            {status === "loading" ? (
              <div className="text-sm text-muted-foreground">Cargando...</div>
            ) : session ? (
              <>
                {/* User Info */}
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg mb-6">
                  <User className="h-5 w-5" />
                  <span className="text-sm font-medium">
                    {session.user?.name || session.user?.email}
                  </span>
                </div>

                {/* Navigation Links */}
                <ButtonLink
                  href="/add-student"
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={closeMobileMenu}
                >
                  <span className="flex items-center gap-3">
                    <UserPlus className="h-5 w-5" />
                    Agregar alumno
                  </span>
                </ButtonLink>

                <ButtonLink
                  href="/add-routine"
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={closeMobileMenu}
                >
                  <span className="flex items-center gap-3">
                    <ListCheck className="h-5 w-5" />
                    Agregar rutina
                  </span>
                </ButtonLink>

                {/* Sign Out Button */}
                <Button
                  variant="ghost"
                  className="w-full justify-start text-destructive hover:text-destructive"
                  onClick={handleSignOut}
                >
                  <span className="flex items-center gap-3">
                    <LogOut className="h-5 w-5" />
                    Cerrar Sesión
                  </span>
                </Button>
              </>
            ) : (
              <div className="space-y-3">
                <ButtonLink
                  href="/auth/signin"
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={closeMobileMenu}
                >
                  Iniciar Sesión
                </ButtonLink>
                <ButtonLink
                  href="/auth/signup"
                  variant="default"
                  className="w-full"
                  onClick={closeMobileMenu}
                >
                  Registrarse
                </ButtonLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
