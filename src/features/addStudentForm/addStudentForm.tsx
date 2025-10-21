"use client";

import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Student } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  age: z.number().min(1, "La edad debe ser mayor a 0"),
  gender: z.string().min(1, "El género es requerido"),
  height: z.number().min(1, "La altura debe ser mayor a 0"),
  weight: z.number().min(1, "El peso debe ser mayor a 0"),
  email: z.union([z.string().email("Email inválido"), z.literal("")]),
  phone: z.string(),
});

interface AddStudentFormProps {
  existingStudent?: Student | null;
  studentId?: string | null;
}

export const AddStudentForm = ({
  existingStudent,
  studentId,
}: AddStudentFormProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isEditMode = !!existingStudent;

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: existingStudent?.name || "",
      age: existingStudent?.age || 0,
      gender: existingStudent?.gender || "",
      height: existingStudent?.height || 0,
      weight: existingStudent?.weight || 0,
      email: existingStudent?.email || "",
      phone: existingStudent?.phone || "",
    },
  });

  // Update form values when existingStudent changes
  useEffect(() => {
    if (existingStudent) {
      form.reset({
        name: existingStudent.name,
        age: existingStudent.age,
        gender: existingStudent.gender,
        height: existingStudent.height,
        weight: existingStudent.weight,
        email: existingStudent.email || "",
        phone: existingStudent.phone || "",
      });
    }
  }, [existingStudent, form]);

  const onSubmit = async (data: z.infer<typeof schema>) => {
    if (!session?.user?.id) {
      setError("Debes estar autenticado para agregar estudiantes");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      let response;

      if (isEditMode && studentId) {
        // Update existing student
        response = await fetch(`/api/students/${studentId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
      } else {
        // Create new student
        response = await fetch("/api/students", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
      }

      const result = await response.json();

      if (response.ok) {
        setSuccess(
          isEditMode
            ? "Estudiante actualizado exitosamente"
            : "Estudiante agregado exitosamente"
        );

        if (!isEditMode) {
          form.reset();
        }

        // Redirect after success
        setTimeout(() => {
          if (isEditMode && studentId) {
            router.push(`/students/${studentId}`);
          } else {
            router.push("/dashboard");
          }
        }, 1500);
      } else {
        setError(
          result.error ||
            (isEditMode
              ? "Error al actualizar el estudiante"
              : "Error al agregar el estudiante")
        );
      }
    } catch {
      setError("Error de conexión. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state if session is loading
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Cargando...</div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (status === "unauthenticated") {
    router.push("/auth/signin");
    return null;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Edad</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Género</FormLabel>
                <FormControl>
                  <Combobox
                    value={field.value}
                    onValueChange={field.onChange}
                    options={[
                      { value: "Masculino", label: "Masculino" },
                      { value: "Femenino", label: "Femenino" },
                    ]}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="height"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Altura</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Peso</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teléfono</FormLabel>
              <FormControl>
                <Input type="tel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && (
          <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-md">
            {error}
          </div>
        )}
        {success && (
          <div className="text-green-600 text-sm text-center bg-green-50 p-3 rounded-md">
            {success}
          </div>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? isEditMode
              ? "Actualizando..."
              : "Guardando..."
            : isEditMode
            ? "Actualizar Estudiante"
            : "Guardar Estudiante"}
        </Button>
      </form>
    </Form>
  );
};
