const features = [
  {
    title: "Ficha de alumnos",
    body: "Nombre, medidas y contacto. Lo que hace falta para armar el plan.",
  },
  {
    title: "Rutinas por día",
    body: "Grupos, ejercicios, series y kilos. Una semana clara para cada alumno.",
  },
  {
    title: "PDF para imprimir",
    body: "La rutina sale en papel, lista para el locker o el mostrador.",
  },
  {
    title: "Ejercicios propios",
    body: "Sumá los movimientos de tu gimnasio, aparte de la biblioteca.",
  },
  {
    title: "Historial",
    body: "Las rutinas anteriores quedan. Ves qué hizo cada alumno.",
  },
  {
    title: "Desde el celular",
    body: "Cargá entre series. No hace falta sentarte a una planilla.",
  },
];

export function FeaturesSection() {
  return (
    <section className="px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto w-full max-w-5xl">
        <h2 className="font-display text-4xl tracking-tight md:text-6xl">
          Lo que usás en el día
        </h2>
        <p className="mt-4 max-w-md text-lg text-ink/70">
          Alumnos, rutinas y PDF. El resto sobra.
        </p>
        <ul className="mt-12 grid gap-x-12 md:grid-cols-2">
          {features.map((feature) => (
            <li
              key={feature.title}
              className="border-b border-ink/15 py-6 last:border-b-0 md:last:border-b md:[&:nth-last-child(-n+2)]:border-b-0"
            >
              <h3 className="border-b border-tape pb-1 font-display text-2xl tracking-tight">
                {feature.title}
              </h3>
              <p className="mt-3 text-ink/70">{feature.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
