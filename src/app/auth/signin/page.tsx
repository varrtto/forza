"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const fieldClass =
  "h-11 rounded-none border-0 border-b border-ink/25 bg-transparent px-0 shadow-none focus-visible:border-tape focus-visible:ring-0";
const labelClass = "font-display text-base text-ink";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Credenciales inválidas");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="font-display text-5xl tracking-tight md:text-7xl">
        Iniciar sesión
      </h1>
      <p className="mt-3 max-w-md text-lg text-ink/70">
        Entrá para ver tus alumnos y armar rutinas.
      </p>
      <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-6">
        <div>
          <Label htmlFor="email" className={labelClass}>
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            tabIndex={1}
            className={`mt-2 ${fieldClass}`}
          />
        </div>
        <div>
          <div className="mb-2 flex items-end justify-between gap-4">
            <Label htmlFor="password" className={labelClass}>
              Contraseña
            </Label>
            <Link
              href="/auth/forgot-password"
              className="font-display text-sm text-ink/60 underline decoration-tape decoration-2 underline-offset-4 hover:text-ink"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            tabIndex={2}
            className={fieldClass}
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <button
          type="submit"
          disabled={isLoading || !email || !password}
          className="mt-2 inline-flex h-12 cursor-pointer items-center justify-center bg-tape px-5 font-display text-lg tracking-wide text-on-tape transition-colors hover:bg-tape/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tape disabled:opacity-50"
        >
          {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
        </button>
      </form>
      <p className="mt-8 text-ink/70">
        ¿No tenés cuenta?{" "}
        <Link
          href="/auth/signup"
          className="font-display text-ink underline decoration-tape decoration-2 underline-offset-4"
        >
          Crear cuenta
        </Link>
      </p>
    </div>
  );
}
