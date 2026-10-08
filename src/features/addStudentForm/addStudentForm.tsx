"use client";

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

const fieldClass =
  "h-11 rounded-none border-0 border-b border-ink/25 bg-transparent px-0 shadow-none focus-visible:border-tape focus-visible:ring-0";
const labelClass = "font-display text-base text-ink";
const comboClass =
  "h-11 rounded-none border-0 border-b border-ink/25 bg-transparent px-0 shadow-none hover:bg-transparent focus-visible:border-tape";

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
        response = await fetch(`/api/students/${studentId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
      } else {
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
            ? "Alumno actualizado"
            : "Alumno agregado"
        );

        if (!isEditMode) {
          form.reset();
        }

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
              ? "No se pudo actualizar el alumno"
              : "No se pudo agregar el alumno")
        );
      }
    } catch {
      setError("Error de conexión. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <p className="py-8 text-ink/70">Cargando...</p>
    );
  }

  if (status === "unauthenticated") {
    router.push("/auth/signin");
    return null;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClass}>Nombre</FormLabel>
              <FormControl>
                <Input type="text" className={fieldClass} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass}>Edad</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    className={fieldClass}
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
              <FormItem>
                <FormLabel className={labelClass}>Género</FormLabel>
                <FormControl>
                  <Combobox
                    value={field.value}
                    onValueChange={field.onChange}
                    className={comboClass}
                    placeholder="Elegir"
                    searchPlaceholder="Buscar"
                    emptyText="No hay opciones"
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
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="height"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass}>Altura (cm)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    className={fieldClass}
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
              <FormItem>
                <FormLabel className={labelClass}>Peso (kg)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    className={fieldClass}
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
              <FormLabel className={labelClass}>Email</FormLabel>
              <FormControl>
                <Input type="email" className={fieldClass} {...field} />
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
              <FormLabel className={labelClass}>Teléfono</FormLabel>
              <FormControl>
                <Input type="tel" className={fieldClass} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
        {success && <p className="text-sm text-ink">{success}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 inline-flex h-12 items-center justify-center bg-tape px-5 font-display text-lg tracking-wide text-on-tape transition-colors hover:bg-tape/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tape disabled:opacity-50"
        >
          {isLoading
            ? isEditMode
              ? "Actualizando..."
              : "Guardando..."
            : isEditMode
              ? "Guardar cambios"
              : "Guardar alumno"}
        </button>
      </form>
    </Form>
  );
};
