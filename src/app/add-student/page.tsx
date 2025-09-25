import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddStudentForm } from "@/features/addStudentForm";

export default function AddStudent() {
  return (
    <div className="font-sans min-h-screen items-center justify-items-center pt-10">
      <div className="w-full max-w-xl">
        <Card className="border-0 shadow-none md:border md:shadow-sm">
          <CardHeader>
            <CardTitle>Agregar Alumno</CardTitle>
          </CardHeader>
          <CardContent>
            <AddStudentForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
