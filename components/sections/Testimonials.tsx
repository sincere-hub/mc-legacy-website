const testimonials = [
  {
    name: "John Smith",
    company: "ABC Holdings",
    message:
      "MC Legacy Media transformed our online presence. The results exceeded our expectations.",
  },
  {
    name: "Sarah Williams",
    company: "Vision Group",
    message:
      "Professional, creative and reliable. They delivered exactly what our business needed.",
  },
  {
    name: "David Moyo",
    company: "Future Brands",
    message:
      "Outstanding service from start to finish. I highly recommend MC Legacy Media.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-yellow-500">
          Testimonials
        </p>

        <h2 className="mt-4 text-4xl font-bold">
          What Our Clients Say
        </h2>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {testimonials.map((item) => (
            <div
              key={item.name}
              className="rounded-2xl border p-8 shadow-sm hover:shadow-xl transition"
            >
              <p className="text-gray-600 italic">
                "{item.message}"
              </p>

              <div className="mt-8">
                <h3 className="font-bold">{item.name}</h3>
                <p className="text-sm text-gray-500">
                  {item.company}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}