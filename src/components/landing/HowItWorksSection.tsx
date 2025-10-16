export function HowItWorksSection() {
  return (
    <section className="px-4 py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Cómo funciona
          </h2>
          <p className="text-lg text-muted-foreground">
            Tres simples pasos para empezar
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto">
              1
            </div>
            <h3 className="text-xl font-semibold">Agrega tus Clientes</h3>
            <p className="text-muted-foreground">
              Registra la información básica de tus estudiantes: nombre, edad,
              medidas y datos de contacto.
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto">
              2
            </div>
            <h3 className="text-xl font-semibold">Crea Rutinas</h3>
            <p className="text-muted-foreground">
              Diseña entrenamientos personalizados día por día, con grupos
              musculares, ejercicios, series y pesos.
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto">
              3
            </div>
            <h3 className="text-xl font-semibold">Genera y Comparte</h3>
            <p className="text-muted-foreground">
              Exporta rutinas a PDF profesionales y compártelas con tus
              clientes en segundos.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
