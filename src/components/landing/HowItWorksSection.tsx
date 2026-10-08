const steps = [
  {
    n: "1",
    title: "Agregá al alumno",
    body: "Nombre, edad, medidas y un teléfono. Con eso armás la ficha.",
  },
  {
    n: "2",
    title: "Armá la rutina",
    body: "Día por día: grupo, ejercicio, series y kilos.",
  },
  {
    n: "3",
    title: "Descargá el PDF",
    body: "Se lo das impreso o por mensaje. Queda en el historial.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="gym-rail px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto w-full max-w-5xl">
        <h2 className="font-display text-4xl tracking-tight md:text-6xl">
          Tres pasos
        </h2>
        <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-12">
          {steps.map((step) => (
            <li key={step.n}>
              <p className="font-display text-6xl leading-none text-tape">
                {step.n}
              </p>
              <h3 className="mt-4 font-display text-2xl tracking-tight">
                {step.title}
              </h3>
              <p className="mt-2 text-current/70">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
