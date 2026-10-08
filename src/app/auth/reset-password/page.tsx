"use client";

import { PasswordStrengthIndicator } from "@/components/auth/PasswordStrengthIndicator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isPasswordValid } from "@/utils/passwordStrength";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

const fieldClass =
  "h-11 rounded-none border-0 border-b border-ink/25 bg-transparent px-0 shadow-none focus-visible:border-tape focus-visible:ring-0";
const labelClass = "font-display text-base text-ink";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      setIsLoading(false);
      return;
    }

    if (!isPasswordValid(password)) {
      setError("La contraseña no cumple con los requisitos mínimos");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push(
            "/auth/signin?message=Contraseña actualizada exitosamente"
          );
        }, 2000);
      } else {
        setError(data.error || "Error al actualizar la contraseña");
      }
    } catch {
      setError("Error al procesar la solicitud");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div>
        <h1 className="font-display text-5xl tracking-tight md:text-7xl">
          Enlace inválido
        </h1>
        <p className="mt-3 max-w-md text-lg text-ink/70">
          El enlace falta o ya no sirve. Pedí uno nuevo.
        </p>
        <Link
          href="/auth/forgot-password"
          className="mt-8 inline-flex h-12 items-center bg-tape px-5 font-display text-lg tracking-wide text-on-tape"
        >
          Pedir nuevo enlace
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-5xl tracking-tight md:text-7xl">
        Nueva contraseña
      </h1>
      <p className="mt-3 max-w-md text-lg text-ink/70">
        Elegí una contraseña nueva para entrar a Forza.
      </p>

      {success ? (
        <p className="mt-10 text-lg text-ink/80">
          Contraseña actualizada. Te llevamos a iniciar sesión.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-6">
          <div>
            <Label htmlFor="password" className={labelClass}>
              Nueva contraseña
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className={`mt-2 ${fieldClass}`}
            />
            <PasswordStrengthIndicator password={password} />
          </div>
          <div>
            <Label htmlFor="confirmPassword" className={labelClass}>
              Confirmar contraseña
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
              className={`mt-2 ${fieldClass}`}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button
            type="submit"
            disabled={
              isLoading ||
              !isPasswordValid(password) ||
              password !== confirmPassword
            }
            className="mt-2 inline-flex h-12 cursor-pointer items-center justify-center bg-tape px-5 font-display text-lg tracking-wide text-on-tape transition-colors hover:bg-tape/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tape disabled:opacity-50"
          >
            {isLoading ? "Actualizando..." : "Actualizar contraseña"}
          </button>
          <Link
            href="/auth/signin"
            className="font-display text-base text-ink/65 underline decoration-tape decoration-2 underline-offset-4 hover:text-ink"
          >
            Volver a iniciar sesión
          </Link>
        </form>
      )}
    </div>
  );
}

export default function ResetPassword() {
  return (
    <Suspense fallback={<p className="text-ink/70">Cargando...</p>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
