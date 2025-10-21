import { Card, CardContent } from "@/components/ui/card";
import { AddStudentForm } from "@/features/addStudentForm";

export default function AddStudent() {
  return (
    <div className="flex flex-colfont-sans min-h-[calc(100vh-72px)] justify-center items-center">
      <div className="flex flex-col w-full max-w-xl gap-4">
        <h1 className="text-2xl font-bold text-center">Agregar Alumno</h1>
        <Card className="border-0 shadow-none md:border md:shadow-sm">
          <CardContent>
            <AddStudentForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
