import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Dumbbell, FileText, TrendingUp, Users, Zap } from "lucide-react";

export function FeaturesSection() {
  return (
    <section className="px-4 py-20 bg-white dark:bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Todo lo que necesitas en un solo lugar
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Simplifica tu trabajo como entrenador con herramientas diseñadas
            específicamente para ti
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Gestión de Estudiantes</h3>
                <p className="text-muted-foreground">
                  Administra toda la información de tus clientes en un solo
                  lugar. Datos personales, historial y progreso.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Dumbbell className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Creación de Rutinas</h3>
                <p className="text-muted-foreground">
                  Diseña rutinas personalizadas con ejercicios específicos,
                  series, repeticiones y pesos para cada cliente.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">PDFs Profesionales</h3>
                <p className="text-muted-foreground">
                  Genera documentos PDF listos para imprimir con un solo
                  click. Formato compacto para rutinas full body.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Planificación Semanal</h3>
                <p className="text-muted-foreground">
                  Organiza entrenamientos por día de la semana. Estructura
                  clara y fácil de seguir para tus clientes.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Rápido y Eficiente</h3>
                <p className="text-muted-foreground">
                  Interfaz intuitiva que te permite crear rutinas completas
                  en minutos, no horas.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Seguimiento</h3>
                <p className="text-muted-foreground">
                  Mantén el historial de rutinas de cada cliente y observa su
                  evolución en el tiempo.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
