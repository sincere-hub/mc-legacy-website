export default function Footer() {
  return (
    <footer className="bg-black px-6 py-16 text-white">

      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-4">

        {/* Brand */}
        <div>
          <h2 className="text-3xl font-bold text-yellow-500">
            MC Legacy
          </h2>

          <p className="mt-4 text-gray-400">
            Building powerful brands through creative media,
            digital marketing and innovative solutions.
          </p>
        </div>


        {/* Company */}
        <div>
          <h3 className="mb-4 text-xl font-semibold">
            Company
          </h3>

          <ul className="space-y-3 text-gray-400">
            <li>Home</li>
            <li>About</li>
            <li>Services</li>
            <li>Portfolio</li>
            <li>Contact</li>
          </ul>
        </div>


        {/* Services */}
        <div>
          <h3 className="mb-4 text-xl font-semibold">
            Services
          </h3>

          <ul className="space-y-3 text-gray-400">
            <li>Branding</li>
            <li>Digital Marketing</li>
            <li>Media Production</li>
            <li>Advertising</li>
          </ul>
        </div>


        {/* Contact */}
        <div>
          <h3 className="mb-4 text-xl font-semibold">
            Contact
          </h3>

          <p className="text-gray-400">
            📞 +27 XX XXX XXXX
          </p>

          <p className="mt-3 text-gray-400">
            ✉ info@mclegacy.co.za
          </p>

          <p className="mt-3 text-gray-400">
            📍 South Africa
          </p>
        </div>

      </div>


      <div className="mt-12 border-t border-gray-800 pt-6 text-center text-gray-500">

        © {new Date().getFullYear()} MC Legacy Media.
        All rights reserved.

      </div>

    </footer>
  );
}