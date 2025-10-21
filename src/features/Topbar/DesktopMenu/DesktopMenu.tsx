import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { LogOut, Settings, UserPlus, Users } from "lucide-react";
import { Session } from "next-auth";

export const DesktopMenu = ({ session, status, handleSignOut }: { session: Session | null; status: "loading" | "authenticated" | "unauthenticated"; handleSignOut: () => void }) => {
  return (
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
  );
};