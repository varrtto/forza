import { ButtonLink } from "@/components/ui/ButtonLink";
import { ListCheck, UserPlus } from "lucide-react";
import Link from "next/link";

export const Topbar = () => {
  return (
    <div className="flex sticky top-0 justify-between items-center bg-background border-b border-border p-2">
      <Link href="/">
        <h1 className="text-2xl font-bold">Forza</h1>
      </Link>
      <div className="flex items-center gap-2">
        <ButtonLink href="/add-student" variant="link">
          <span className="flex items-center gap-2">
            Agregar alumno
            <UserPlus className="h-4 w-4" />
          </span>
        </ButtonLink>
        <ButtonLink href="/add-routine" variant="link">
          <span className="flex items-center gap-2">
            Agregar rutina
            <ListCheck className="h-4 w-4" />
          </span>
        </ButtonLink>
      </div>
    </div>
  );
};
