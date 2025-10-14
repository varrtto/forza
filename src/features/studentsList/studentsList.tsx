import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { Student } from "@/types";
import { User } from "lucide-react";
import { getServerSession } from "next-auth";
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
      <div className="text-center p-8">
        <p className="text-muted-foreground">
          Debes iniciar sesión para ver los estudiantes
        </p>
      </div>
    );
  }

  const students = await getStudents();

  if (students.length === 0) {
    return (
      <div className="text-center p-8">
        <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No hay estudiantes</h3>
        <p className="text-muted-foreground mb-4">
          Agrega tu primer estudiante para comenzar
        </p>
      </div>
    );
  }

  return <StudentsListClient initialStudents={students} />;
};
