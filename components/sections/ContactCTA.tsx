export default function ContactCTA() {
  return (
    <section className="bg-neutral-950 px-6 py-24 text-white">

      <div className="mx-auto max-w-5xl text-center">

        <h2 className="text-5xl font-extrabold leading-tight md:text-6xl">
          Let's Create Something
          <span className="text-yellow-500">
            {" "}Legendary
          </span>
        </h2>


        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300">
          MC Legacy Media helps businesses build powerful brands
          through creative media, marketing and digital solutions.
        </p>


        <div className="mt-10 flex flex-wrap justify-center gap-5">

          <a
            href="tel:+27700000000"
            className="rounded-lg bg-yellow-500 px-8 py-4 font-semibold text-black transition hover:-translate-y-1"
          >
            📞 Call MC Legacy
          </a>


          <a
            href="https://wa.me/27700000000"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-green-500 px-8 py-4 font-semibold text-white transition hover:-translate-y-1"
          >
            💬 WhatsApp Us
          </a>


        </div>

      </div>

    </section>
  );
}