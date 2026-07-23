const projects = [
  {
    title: "Brand Identity",
    category: "Branding",
  },
  {
    title: "Corporate Event",
    category: "Events",
  },
  {
    title: "Social Media Campaign",
    category: "Marketing",
  },
  {
    title: "Business Website",
    category: "Web Design",
  },
  {
    title: "Product Launch",
    category: "Advertising",
  },
  {
    title: "Video Production",
    category: "Media",
  },
];

export default function Portfolio() {
  return (
    <section className="bg-neutral-950 py-24 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-yellow-400">
          Portfolio
        </p>

        <h2 className="mt-4 text-4xl font-bold">
          Some Of Our Work
        </h2>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.title}
              className="group overflow-hidden rounded-2xl bg-neutral-900 transition hover:-translate-y-2"
            >
              <div className="flex h-64 items-center justify-center bg-neutral-800 text-6xl">
                🖼️
              </div>

              <div className="p-6">
                <p className="text-sm text-yellow-400">
                  {project.category}
                </p>

                <h3 className="mt-2 text-2xl font-semibold">
                  {project.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}