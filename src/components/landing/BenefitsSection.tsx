const benefits = [
  {
    title: "Menos papeleo",
    body: "La rutina se arma en minutos y sale en PDF. No en una planilla.",
  },
  {
    title: "Un solo roster",
    body: "Alumnos, medidas e historial en el mismo lugar.",
  },
  {
    title: "Se lee en el piso",
    body: "Tipografía grande, una página. El alumno la sigue sin adivinar.",
  },
];

export function BenefitsSection() {
  return (
    <section className="px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto w-full max-w-5xl">
        <h2 className="max-w-xl font-display text-4xl tracking-tight md:text-6xl">
          Más tiempo en el piso, menos en la notebook.
        </h2>
        <ul className="mt-12 max-w-xl">
          {benefits.map((benefit) => (
            <li
              key={benefit.title}
              className="border-b border-ink/15 py-6 first:border-t"
            >
              <h3 className="font-display text-2xl tracking-tight">
                {benefit.title}
              </h3>
              <p className="mt-2 text-ink/70">{benefit.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
