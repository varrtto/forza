"use client";

import type { Student } from "@/types";
import { Search, Trash2, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface StudentsListClientProps {
  initialStudents: Student[];
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export const StudentsListClient = ({
  initialStudents,
}: StudentsListClientProps) => {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [filteredStudents, setFilteredStudents] =
    useState<Student[]>(initialStudents);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setStudents(initialStudents);
    setFilteredStudents(initialStudents);
  }, [initialStudents]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter((student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStudents(filtered);
    }
  }, [searchTerm, students]);

  const deleteStudent = async (studentId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este estudiante?")) {
      return;
    }

    try {
      const response = await fetch(`/api/students/${studentId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const updatedStudents = students.filter(
          (student) => student.id !== studentId
        );
        setStudents(updatedStudents);
        setFilteredStudents(updatedStudents);
        router.refresh();
      } else {
        const data = await response.json();
        setError(data.error || "Error al eliminar estudiante");
      }
    } catch {
      setError("Error de conexión");
    }
  };

  if (error) {
    return (
      <div className="py-16">
        <p className="text-lg">{error}</p>
        <button
          type="button"
          onClick={() => setError("")}
          className="mt-6 inline-flex h-12 cursor-pointer items-center bg-tape px-5 font-display text-lg tracking-wide text-on-tape hover:bg-tape/90"
        >
          Cerrar
        </button>
      </div>
    );
  }

  const countLabel =
    filteredStudents.length === 1
      ? "1 alumno"
      : `${filteredStudents.length} alumnos`;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="shrink-0 bg-floor pt-10 pr-3 pb-2 md:pt-14">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-display text-5xl tracking-tight md:text-7xl">
              Alumnos
            </h1>
            <p className="mt-2 text-ink/65">{countLabel}</p>
          </div>
          <Link
            href="/add-student"
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2 bg-tape px-5 font-display text-lg tracking-wide text-on-tape transition-colors hover:bg-tape/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tape"
          >
            <UserPlus className="h-5 w-5" />
            Agregar alumno
          </Link>
        </div>

        <div className="gym-rail mt-8 flex items-center gap-3 px-4 py-3 md:px-5">
          <Search className="h-4 w-4 shrink-0 opacity-70" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar alumno"
            aria-label="Buscar alumno"
            className="h-10 w-full bg-transparent text-base outline-none placeholder:text-floor/50 dark:placeholder:text-ink/40"
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-3">
        {filteredStudents.length === 0 && searchTerm ? (
          <div className="py-16">
            <h2 className="font-display text-3xl tracking-tight">
              Nadie se llama así
            </h2>
            <p className="mt-3 text-ink/70">
              No hay alumnos que coincidan con “{searchTerm}”.
            </p>
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="mt-6 cursor-pointer font-display text-lg text-ink underline decoration-tape decoration-2 underline-offset-4"
            >
              Limpiar búsqueda
            </button>
          </div>
        ) : (
          <ul className="mt-2 mb-12">
            {filteredStudents.map((student) => (
              <li
                key={student.id}
                className="flex items-center gap-3 border-b border-ink/15 md:gap-4"
              >
                <Link
                  href={`/students/${student.id}`}
                  className="grid min-w-0 flex-1 grid-cols-[auto_1fr] items-center gap-4 py-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tape md:gap-8"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center bg-ink font-display text-lg text-floor dark:bg-tape dark:text-on-tape">
                    {initials(student.name)}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display text-2xl leading-none tracking-tight md:text-3xl">
                      {student.name}
                    </span>
                    <span className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink/65">
                      <span>{student.age} años</span>
                      <span>{student.height} cm</span>
                      <span>{student.weight} kg</span>
                      <span>{student.gender}</span>
                    </span>
                    {(student.email || student.phone) && (
                      <span className="mt-1 block truncate text-sm text-ink/50">
                        {[student.email, student.phone]
                          .filter(Boolean)
                          .join("  ")}
                      </span>
                    )}
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => deleteStudent(student.id)}
                  aria-label={`Eliminar a ${student.name}`}
                  className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center text-ink/40 transition-colors hover:text-destructive focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tape"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
