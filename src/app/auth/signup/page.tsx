"use client";

import { PasswordStrengthIndicator } from "@/components/auth/PasswordStrengthIndicator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isPasswordValid } from "@/utils/passwordStrength";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useReducer } from "react";
import { initialState, signUpReducer } from "./signUpReducer";

const fieldClass =
  "h-11 rounded-none border-0 border-b border-ink/25 bg-transparent px-0 shadow-none focus-visible:border-tape focus-visible:ring-0";
const labelClass = "font-display text-base text-ink";

export default function SignUp() {
  const [state, dispatch] = useReducer(signUpReducer, initialState);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "RESET_ERROR" });

    if (state.password !== state.confirmPassword) {
      dispatch({ type: "SET_ERROR", payload: "Las contraseñas no coinciden" });
      dispatch({ type: "SET_LOADING", payload: false });
      return;
    }

    if (!isPasswordValid(state.password)) {
      dispatch({
        type: "SET_ERROR",
        payload: "La contraseña no cumple con los requisitos mínimos",
      });
      dispatch({ type: "SET_LOADING", payload: false });
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: state.name,
          email: state.email,
          password: state.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/auth/signin?message=Cuenta creada exitosamente");
      } else {
        dispatch({
          type: "SET_ERROR",
          payload: data.error || "Error al crear la cuenta",
        });
      }
    } catch {
      dispatch({ type: "SET_ERROR", payload: "Error al crear la cuenta" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  return (
    <div>
      <h1 className="font-display text-5xl tracking-tight md:text-7xl">
        Crear cuenta
      </h1>
      <p className="mt-3 max-w-md text-lg text-ink/70">
        Nombre, email y una contraseña. Después cargás al primer alumno.
      </p>
      <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-6">
        <div>
          <Label htmlFor="name" className={labelClass}>
            Nombre
          </Label>
          <Input
            id="name"
            type="text"
            value={state.name}
            onChange={(e) =>
              dispatch({ type: "SET_NAME", payload: e.target.value })
            }
            required
            disabled={state.isLoading}
            className={`mt-2 ${fieldClass}`}
          />
        </div>
        <div>
          <Label htmlFor="email" className={labelClass}>
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={state.email}
            onChange={(e) =>
              dispatch({ type: "SET_EMAIL", payload: e.target.value })
            }
            required
            disabled={state.isLoading}
            className={`mt-2 ${fieldClass}`}
          />
        </div>
        <div>
          <Label htmlFor="password" className={labelClass}>
            Contraseña
          </Label>
          <Input
            id="password"
            type="password"
            value={state.password}
            onChange={(e) =>
              dispatch({ type: "SET_PASSWORD", payload: e.target.value })
            }
            required
            disabled={state.isLoading}
            className={`mt-2 ${fieldClass}`}
          />
          <PasswordStrengthIndicator password={state.password} />
        </div>
        <div>
          <Label htmlFor="confirmPassword" className={labelClass}>
            Confirmar contraseña
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            value={state.confirmPassword}
            onChange={(e) =>
              dispatch({
                type: "SET_CONFIRM_PASSWORD",
                payload: e.target.value,
              })
            }
            required
            disabled={state.isLoading}
            className={`mt-2 ${fieldClass}`}
          />
        </div>
        {state.error && <p className="text-sm text-destructive">{state.error}</p>}
        <button
          type="submit"
          disabled={
            state.isLoading ||
            !isPasswordValid(state.password) ||
            state.password !== state.confirmPassword
          }
          className="mt-2 inline-flex h-12 cursor-pointer items-center justify-center bg-tape px-5 font-display text-lg tracking-wide text-on-tape transition-colors hover:bg-tape/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tape disabled:opacity-50"
        >
          {state.isLoading ? "Creando cuenta..." : "Crear cuenta"}
        </button>
      </form>
      <p className="mt-8 text-ink/70">
        ¿Ya tenés cuenta?{" "}
        <Link
          href="/auth/signin"
          className="font-display text-ink underline decoration-tape decoration-2 underline-offset-4"
        >
          Iniciar sesión
        </Link>
      </p>
    </div>
  );
}
