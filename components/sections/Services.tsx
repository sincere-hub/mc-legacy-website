const services = [
  {
    title: "Digital Marketing",
    description: "Helping businesses grow through effective online marketing strategies.",
    icon: "📈",
  },
  {
    title: "Branding",
    description: "Building strong and memorable brands that stand out.",
    icon: "🎨",
  },
  {
    title: "Media Production",
    description: "Professional photography, videography and content creation.",
    icon: "🎥",
  },
  {
    title: "Social Media",
    description: "Managing social media platforms to increase engagement.",
    icon: "📱",
  },
  {
    title: "Web Development",
    description: "Modern, responsive websites that convert visitors into customers.",
    icon: "💻",
  },
  {
    title: "Event Management",
    description: "Planning and managing unforgettable corporate and public events.",
    icon: "🎤",
  },
];

export default function Services() {
  return (
    <section className="bg-gray-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-yellow-500">
          Our Services
        </p>

        <h2 className="mt-4 text-4xl font-bold">
          What We Do
        </h2>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.title}
              className="rounded-2xl bg-white p-8 shadow transition hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="text-5xl">{service.icon}</div>

              <h3 className="mt-6 text-2xl font-semibold">
                {service.title}
              </h3>

              <p className="mt-4 text-gray-600">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}