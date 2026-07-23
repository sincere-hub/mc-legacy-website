export default function About() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-yellow-500">
          About Us
        </p>

        <h2 className="mt-4 text-4xl font-bold text-gray-900">
          We Create Brands That Make An Impact.
        </h2>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-600">
          MC Legacy Media is a creative agency that helps businesses grow
          through branding, digital marketing, media production, advertising,
          and innovative digital solutions.
        </p>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          <div className="rounded-2xl border p-8 shadow-sm">
            <h3 className="text-2xl font-semibold">Creative</h3>
            <p className="mt-4 text-gray-600">
              We design brands that stand out and leave a lasting impression.
            </p>
          </div>

          <div className="rounded-2xl border p-8 shadow-sm">
            <h3 className="text-2xl font-semibold">Strategy</h3>
            <p className="mt-4 text-gray-600">
              Every campaign is built with clear business goals and measurable
              results.
            </p>
          </div>

          <div className="rounded-2xl border p-8 shadow-sm">
            <h3 className="text-2xl font-semibold">Growth</h3>
            <p className="mt-4 text-gray-600">
              We help businesses reach more customers and grow their digital
              presence.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}