"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Student } from "@/types";
import { Search, Trash2, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const StudentsList = () => {
  const { status } = useSession();
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "authenticated") {
      fetchStudents();
    }
  }, [status]);

  const fetchStudents = async () => {
    try {
      const response = await fetch("/api/students");
      const data = await response.json();

      if (response.ok) {
        setStudents(data.students);
        setFilteredStudents(data.students);
      } else {
        setError(data.error || "Error al cargar estudiantes");
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  // Filter students based on search term
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
      } else {
        const data = await response.json();
        setError(data.error || "Error al eliminar estudiante");
      }
    } catch {
      setError("Error de conexión");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Cargando estudiantes...</div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">
          Debes iniciar sesión para ver los estudiantes
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500">{error}</p>
        <Button onClick={fetchStudents} className="mt-4">
          Reintentar
        </Button>
      </div>
    );
  }

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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Mis Estudiantes</h2>
        <p className="text-muted-foreground">
          {filteredStudents.length} estudiante(s)
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="Buscar por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredStudents.length === 0 && searchTerm ? (
        <div className="text-center p-8">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            No se encontraron estudiantes
          </h3>
          <p className="text-muted-foreground mb-4">
            No hay estudiantes que coincidan con &quot;{searchTerm}&quot;
          </p>
          <Button onClick={() => setSearchTerm("")} variant="outline" size="sm">
            Limpiar búsqueda
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredStudents.map((student) => (
            <Card
              key={student.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => router.push(`/students/${student.id}`)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{student.name}</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteStudent(student.id);
                    }}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Edad:</span>
                    <span className="ml-1">{student.age} años</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Género:</span>
                    <span className="ml-1 capitalize">{student.gender}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Altura:</span>
                    <span className="ml-1">{student.height} cm</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Peso:</span>
                    <span className="ml-1">{student.weight} kg</span>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="ml-1">{student.email}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Teléfono:</span>
                    <span className="ml-1">{student.phone}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
