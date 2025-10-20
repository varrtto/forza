"use client";

import { ButtonLink } from "@/components/ui/ButtonLink";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, Settings, UserPlus, Users } from "lucide-react";
import { Session } from "next-auth";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  session: Session | null;
  status: "loading" | "authenticated" | "unauthenticated";
  onSignOut: () => void;
}

export const MobileMenu = ({
  isOpen,
  onClose,
  session,
  status,
  onSignOut,
}: MobileMenuProps) => {
  return (
    <>
      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-[65px] right-0 h-full left-0 bg-background border-l border-border shadow-lg transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6">
          {/* Mobile Menu Content */}
          <div className="space-y-4">
            {status === "loading" ? (
              <div className="text-sm text-muted-foreground">Cargando...</div>
            ) : session ? (
              <>
                {/* Navigation Links */}
                <ButtonLink
                  href="/dashboard"
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={onClose}
                >
                  <span className="flex items-center gap-3 text-lg">
                    <Users size={48} />
                    Dashboard
                  </span>
                </ButtonLink>

                <ButtonLink
                  href="/add-student"
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={onClose}
                >
                  <span className="flex items-center gap-3 text-lg">
                    <UserPlus size={48} />
                    Agregar alumno
                  </span>
                </ButtonLink>

                <ButtonLink
                  href="/profile"
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={onClose}
                >
                  <span className="flex items-center gap-3 text-lg">
                    <Settings size={48} />
                    Mi Perfil
                  </span>
                </ButtonLink>

                {/* Sign Out Button */}
                <Button
                  variant="ghost"
                  className="w-full justify-start text-destructive hover:text-destructive"
                  onClick={onSignOut}
                >
                  <span className="flex items-center gap-3 text-lg">
                    <LogOut size={48} />
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
                  onClick={onClose}
                >
                  <LogIn className="h-5 w-5" />
                  Iniciar Sesión
                </ButtonLink>
                <ButtonLink
                  href="/auth/signup"
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={onClose}
                >
                  <UserPlus className="h-5 w-5" />
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
