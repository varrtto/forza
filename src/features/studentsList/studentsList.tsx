import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { Student } from "@/types";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { StudentsListClient } from "./StudentsListClient";

async function getStudents(): Promise<Student[]> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return [];
  }

  try {
    const { data: students, error } = await supabaseAdmin
      .from("students")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching students:", error);
      return [];
    }

    return students || [];
  } catch (error) {
    console.error("Error fetching students:", error);
    return [];
  }
}

export const StudentsList = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="py-16">
        <h1 className="font-display text-5xl tracking-tight md:text-6xl">
          Alumnos
        </h1>
        <p className="mt-4 max-w-md text-lg text-ink/70">
          Inicia sesión para ver tus alumnos y armar rutinas.
        </p>
      </div>
    );
  }

  const students = await getStudents();

  if (students.length === 0) {
    return (
      <div className="py-8 md:py-12">
        <h1 className="font-display text-5xl tracking-tight md:text-7xl">
          Alumnos
        </h1>
        <p className="mt-5 max-w-md text-lg text-ink/70">
          Todavía no hay nadie en el piso. Agrega el primero para empezar a
          armar rutinas.
        </p>
        <Link
          href="/add-student"
          className="mt-8 inline-flex h-12 items-center bg-tape px-5 font-display text-lg tracking-wide text-on-tape transition-colors hover:bg-tape/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tape"
        >
          Agregar alumno
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <StudentsListClient initialStudents={students} />
    </div>
  );
};
