export default function InvoicesPage() {
  return (
    <main className="min-h-screen bg-neutral-950 p-8 text-white">

      <h1 className="text-4xl font-bold text-yellow-500">
        Invoices
      </h1>

      <p className="mt-3 text-gray-400">
        Create and manage company invoices.
      </p>


      <div className="mt-10 rounded-xl bg-neutral-900 p-6">

        <div className="flex items-center justify-between">

          <h2 className="text-2xl font-semibold">
            Invoice Management
          </h2>


          <button className="rounded-lg bg-yellow-500 px-6 py-3 font-semibold text-black">
            Create Invoice
          </button>

        </div>



        <div className="mt-8 overflow-hidden rounded-lg">

          <table className="w-full text-left">

            <thead className="bg-neutral-800">

              <tr>

                <th className="p-4">
                  Invoice
                </th>

                <th className="p-4">
                  Client
                </th>

                <th className="p-4">
                  Amount
                </th>

                <th className="p-4">
                  Status
                </th>

              </tr>

            </thead>


            <tbody>

              <tr className="border-t border-neutral-800">

                <td className="p-4 text-gray-400">
                  No invoices
                </td>

                <td className="p-4 text-gray-400">
                  -
                </td>

                <td className="p-4 text-gray-400">
                  -
                </td>

                <td className="p-4 text-gray-400">
                  -
                </td>

              </tr>

            </tbody>

          </table>

        </div>


      </div>


    </main>
  );
}