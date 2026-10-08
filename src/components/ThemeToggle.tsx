"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Cambiar tema"
      title={isDark ? "Modo claro" : "Modo oscuro"}
      className="flex h-10 w-10 cursor-pointer items-center justify-center text-current/70 hover:text-tape"
    >
      <span className="relative h-6 w-6">
        <Sun
          className={`absolute inset-0 h-6 w-6 transition-all duration-300 ease-out ${
            isDark
              ? "rotate-90 scale-50 opacity-0"
              : "rotate-0 scale-100 opacity-100"
          }`}
        />
        <Moon
          className={`absolute inset-0 h-6 w-6 transition-all duration-300 ease-out ${
            isDark
              ? "rotate-0 scale-100 opacity-100"
              : "-rotate-90 scale-50 opacity-0"
          }`}
        />
      </span>
    </button>
  );
}
