"use client";

import { PasswordStrengthIndicator } from "@/components/auth/PasswordStrengthIndicator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isPasswordValid } from "@/utils/passwordStrength";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useReducer } from "react";
import { initialState, signUpReducer } from "./signUpReducer";

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
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Crear Cuenta</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                type="text"
                value={state.name}
                onChange={(e) =>
                  dispatch({ type: "SET_NAME", payload: e.target.value })
                }
                required
                disabled={state.isLoading}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={state.email}
                onChange={(e) =>
                  dispatch({ type: "SET_EMAIL", payload: e.target.value })
                }
                required
                disabled={state.isLoading}
              />
            </div>
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={state.password}
                onChange={(e) =>
                  dispatch({ type: "SET_PASSWORD", payload: e.target.value })
                }
                required
                disabled={state.isLoading}
              />
              <PasswordStrengthIndicator password={state.password} />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
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
              />
            </div>
            {state.error && (
              <div className="text-red-500 text-sm text-center">
                {state.error}
              </div>
            )}
            <Button 
              type="submit" 
              className="w-full" 
              disabled={
                state.isLoading || 
                !isPasswordValid(state.password) ||
                state.password !== state.confirmPassword
              }
            >
              {state.isLoading ? "Creando cuenta..." : "Crear Cuenta"}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes cuenta?{" "}
              <Link
                href="/auth/signin"
                className="text-blue-600 hover:underline"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
  );
}
