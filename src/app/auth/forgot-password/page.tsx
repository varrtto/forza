"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";

const fieldClass =
  "h-11 rounded-none border-0 border-b border-ink/25 bg-transparent px-0 shadow-none focus-visible:border-tape focus-visible:ring-0";
const labelClass = "font-display text-base text-ink";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
      } else {
        setError(data.error || "Error al enviar el email");
      }
    } catch {
      setError("Error al procesar la solicitud");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="font-display text-5xl tracking-tight md:text-7xl">
        Recuperar contraseña
      </h1>
      <p className="mt-3 max-w-md text-lg text-ink/70">
        Ingresá tu email y te mandamos un enlace para armar una nueva.
      </p>

      {success ? (
        <div className="mt-10">
          <p className="max-w-md text-lg text-ink/80">
            Si el email está en Forza, vas a recibir el enlace en unos minutos.
          </p>
          <Link
            href="/auth/signin"
            className="mt-8 inline-block font-display text-lg text-ink underline decoration-tape decoration-2 underline-offset-4"
          >
            Volver a iniciar sesión
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-6">
          <div>
            <Label htmlFor="email" className={labelClass}>
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className={`mt-2 ${fieldClass}`}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 inline-flex h-12 cursor-pointer items-center justify-center bg-tape px-5 font-display text-lg tracking-wide text-on-tape transition-colors hover:bg-tape/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tape disabled:opacity-50"
          >
            {isLoading ? "Enviando..." : "Enviar enlace"}
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
