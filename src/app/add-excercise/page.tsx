"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { MUSCLE_GROUPS } from "@/features/addRoutineForm/addRoutineForm.constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  muscleGroup: z.string().min(1, "El grupo muscular es requerido"),
  exerciseName: z.string().min(1, "El nombre del ejercicio es requerido"),
});

interface UserExercise {
  id: string;
  user_id: string;
  muscle_group: string;
  name: string;
  created_at: string;
  updated_at: string;
}

const AddExcercisePage = () => {
  const [exercises, setExercises] = useState<UserExercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      muscleGroup: "",
      exerciseName: "",
    },
  });

  // Fetch exercises on component mount
  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("/api/exercises");
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al cargar ejercicios");
      }

      const data = await response.json();
      setExercises(data.exercises || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error de conexión");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      setError(null);
      setSuccess(null);

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

      setSuccess("Ejercicio agregado exitosamente");
      form.reset();
      
      // Refresh exercises list
      await fetchExercises();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error de conexión");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (exerciseId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este ejercicio?")) {
      return;
    }

    try {
      setError(null);
      const response = await fetch(`/api/exercises/${exerciseId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al eliminar ejercicio");
      }

      // Remove exercise from local state
      setExercises(exercises.filter((ex) => ex.id !== exerciseId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error de conexión");
    }
  };

  // Group exercises by muscle group
  const exercisesByMuscleGroup = exercises.reduce((acc, exercise) => {
    if (!acc[exercise.muscle_group]) {
      acc[exercise.muscle_group] = [];
    }
    acc[exercise.muscle_group].push(exercise);
    return acc;
  }, {} as Record<string, UserExercise[]>);

  return (
    <div className="flex flex-col justify-center items-center min-h-[calc(100vh-72px)] gap-4 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Agregar Ejercicio</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
              {error && (
                <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                  {error}
                </div>
              )}
              {success && (
                <div className="p-3 bg-green-500/10 text-green-600 rounded-md text-sm">
                  {success}
                </div>
              )}
              <FormField
                control={form.control}
                name="muscleGroup"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grupo Muscular</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value} >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecciona un grupo muscular" />
                        </SelectTrigger>
                        <SelectContent>
                          {MUSCLE_GROUPS.map((group) => (
                            <SelectItem key={group} value={group} >
                              {group}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                    <FormLabel>Nombre del Ejercicio</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ej: Press banca inclinado" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Agregando...
                  </>
                ) : (
                  "Agregar Ejercicio"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Ejercicios Agregados</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : exercises.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No has agregado ejercicios personalizados aún
            </p>
          ) : (
            <div className="space-y-6">
              {Object.entries(exercisesByMuscleGroup).map(([muscleGroup, groupExercises]) => (
                <div key={muscleGroup}>
                  <h3 className="font-semibold text-lg mb-3">{muscleGroup}</h3>
                  <div className="space-y-2">
                    {groupExercises.map((exercise) => (
                      <div
                        key={exercise.id}
                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                      >
                        <span className="flex-1">{exercise.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(exercise.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AddExcercisePage;
