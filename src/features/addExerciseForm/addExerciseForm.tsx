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
import { MUSCLE_GROUPS } from "@/features/addRoutineForm/addRoutineForm.constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  muscleGroup: z.string().min(1, "El grupo muscular es requerido"),
  exerciseName: z.string().min(1, "El nombre del ejercicio es requerido"),
});

const fieldClass =
  "h-11 rounded-none border-0 border-b border-ink/25 bg-transparent px-0 shadow-none focus-visible:border-tape focus-visible:ring-0";
const labelClass = "font-display text-base text-ink";
const comboClass =
  "h-11 rounded-none border-0 border-b border-ink/25 bg-transparent px-0 shadow-none hover:bg-transparent focus-visible:border-tape";

export const AddExerciseForm = () => {
  const [actionError, setActionError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      muscleGroup: "",
      exerciseName: "",
    },
  });

  const addExerciseMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const response = await fetch("/api/exercises", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          muscleGroup: values.muscleGroup,
          name: values.exerciseName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al crear ejercicio");
      }

      return data;
    },
    onSuccess: async () => {
      setSuccess("Ejercicio agregado");
      form.reset();
      await queryClient.invalidateQueries({ queryKey: ["exercises"] });
    },
    onError: (err) => {
      setActionError(err instanceof Error ? err.message : "Error de conexión");
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setActionError(null);
    setSuccess(null);
    addExerciseMutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <FormField
          control={form.control}
          name="muscleGroup"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClass}>Grupo muscular</FormLabel>
              <FormControl>
                <Combobox
                  value={field.value}
                  onValueChange={field.onChange}
                  className={comboClass}
                  placeholder="Elegir grupo"
                  searchPlaceholder="Buscar grupo"
                  emptyText="No hay grupos"
                  options={MUSCLE_GROUPS.map((group) => ({
                    value: group,
                    label: group,
                  }))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="exerciseName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClass}>Nombre</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className={fieldClass}
                  placeholder="Press banca inclinado"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {actionError && (
          <p className="text-sm text-destructive">{actionError}</p>
        )}
        {success && (
          <p className="text-sm text-ink">
            {success}.{" "}
            <Link
              href="/exercises"
              className="font-display underline decoration-tape decoration-2 underline-offset-4"
            >
              Ver lista
            </Link>
          </p>
        )}
        <button
          type="submit"
          disabled={addExerciseMutation.isPending}
          className="mt-2 inline-flex h-12 cursor-pointer items-center justify-center bg-tape px-5 font-display text-lg tracking-wide text-on-tape transition-colors hover:bg-tape/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tape disabled:opacity-50"
        >
          {addExerciseMutation.isPending ? "Agregando..." : "Agregar ejercicio"}
        </button>
      </form>
    </Form>
  );
};
