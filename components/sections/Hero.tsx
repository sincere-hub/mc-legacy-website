export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center bg-neutral-950 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <span className="rounded-full border border-yellow-500 px-4 py-2 text-sm text-yellow-400">
          Digital • Media • Marketing
        </span>

        <h1 className="mt-8 max-w-4xl text-6xl font-extrabold leading-tight">
          Building Powerful Brands Through Creative Media.
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-gray-300">
          MC Legacy Media helps businesses grow through branding, digital
          marketing, media production, advertising and innovative business
          solutions.
        </p>

        <div className="mt-10 flex gap-5">
          <button className="rounded-lg bg-yellow-500 px-8 py-4 font-semibold text-black">
            Get Started
          </button>

          <button className="rounded-lg border border-white px-8 py-4">
            View Portfolio
          </button>
        </div>
      </div>
    </section>
  );
}