const features = [
  {
    title: "Creative Team",
    description: "Our experienced team delivers creative solutions that help your business stand out.",
  },
  {
    title: "Results Driven",
    description: "Every strategy is designed to generate measurable growth and real business results.",
  },
  {
    title: "Modern Technology",
    description: "We use the latest digital tools to keep your brand ahead of the competition.",
  },
  {
    title: "Trusted Partner",
    description: "We build long-term relationships by delivering quality and reliability.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-yellow-500">
          Why Choose Us
        </p>

        <h2 className="mt-4 text-4xl font-bold text-gray-900">
          Your Growth Is Our Priority
        </h2>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-gray-200 p-8 transition hover:border-yellow-500 hover:shadow-xl"
            >
              <h3 className="text-2xl font-semibold">
                {feature.title}
              </h3>

              <p className="mt-4 text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}