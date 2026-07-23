export default function ContractsPage() {
  return (
    <main className="min-h-screen bg-neutral-950 p-8 text-white">

      <h1 className="text-4xl font-bold text-yellow-500">
        Contracts
      </h1>

      <p className="mt-3 text-gray-400">
        Manage client agreements and company contracts.
      </p>


      <div className="mt-10 rounded-xl bg-neutral-900 p-6">

        <h2 className="text-2xl font-semibold">
          Contract Management
        </h2>

        <p className="mt-4 text-gray-400">
          No contracts uploaded yet.
        </p>


        <button className="mt-6 rounded-lg bg-yellow-500 px-6 py-3 font-semibold text-black">
          Upload Contract
        </button>

      </div>

    </main>
  );
}