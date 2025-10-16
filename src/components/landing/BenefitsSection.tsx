import { CheckCircle2, Clock } from "lucide-react";

export function BenefitsSection() {
  return (
    <section className="px-4 py-20 bg-white dark:bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Más tiempo para entrenar, menos tiempo en papeleo
            </h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Ahorra tiempo</h3>
                  <p className="text-muted-foreground">
                    Crea rutinas en minutos en lugar de horas
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Más profesional</h3>
                  <p className="text-muted-foreground">
                    PDFs con diseño limpio y fácil de leer
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Organización total</h3>
                  <p className="text-muted-foreground">
                    Todo tu historial en un solo lugar accesible
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Clock className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Acceso 24/7</h3>
                  <p className="text-muted-foreground">
                    Trabaja desde cualquier lugar, en cualquier momento
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl p-8 md:p-12">
            <div className="space-y-6">
              <div className="text-6xl font-bold text-primary">10x</div>
              <p className="text-xl font-semibold">Más rápido</p>
              <p className="text-muted-foreground">
                Los entrenadores reportan que pueden crear y gestionar rutinas
                hasta 10 veces más rápido usando Forza comparado con métodos
                tradicionales.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
