"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ButtonLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "link" | "outline" | "secondary" | "ghost";
}

/**
 * ButtonLink
 * Combina un Button de shadcn con un Link de Next.js.
 *
 * Ejemplo de uso:
 * <ButtonLink href="/add-routine" variant="link">
 *   <span>Agregar rutina</span>
 *   <ListCheck className="h-4 w-4" />
 * </ButtonLink>
 */
export function ButtonLink({
  href,
  children,
  className,
  variant,
  ...props
}: ButtonLinkProps) {
  return (
    <Button asChild variant={variant} {...props}>
      <Link href={href} className={cn("flex items-center gap-2", className)}>
        {children}
      </Link>
    </Button>
  );
}
