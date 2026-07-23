export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-6 text-white">

      <div className="w-full max-w-md rounded-2xl bg-neutral-900 p-8 shadow-xl">

        <h1 className="text-center text-4xl font-bold text-yellow-500">
          MC Legacy Portal
        </h1>

        <p className="mt-3 text-center text-gray-400">
          Member Login
        </p>


        <form className="mt-8 space-y-5">

          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Email
            </label>

            <input
              type="email"
              placeholder="name@mclegacy.co.za"
              className="w-full rounded-lg bg-neutral-800 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>


          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Password
            </label>

            <input
              type="password"
              placeholder="********"
              className="w-full rounded-lg bg-neutral-800 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>


          <button
            type="submit"
            className="w-full rounded-lg bg-yellow-500 py-3 font-semibold text-black transition hover:bg-yellow-400"
          >
            Login
          </button>


        </form>


      </div>

    </main>
  );
}