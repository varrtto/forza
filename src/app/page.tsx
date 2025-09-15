import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StudentsTable } from "@/features/studentsTable";

export default function Home() {
  return (
    <div className="flex flex-col font-sans min-h-screen items-center justify-items-center pt-10 gap-4">
      <h1 className="text-2xl font-bold">Bienvenido</h1>
      <p className="text-muted-foreground text-sm">
        Aquí puedes agregar alumnos y rutinas de entrenamiento
      </p>
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Alumnos</CardTitle>
        </CardHeader>
        <CardContent>
          <StudentsTable />
        </CardContent>
      </Card>
    </div>
  );
}
