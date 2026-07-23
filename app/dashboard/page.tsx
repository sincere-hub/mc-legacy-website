export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">

      <div className="flex">

        {/* Sidebar */}
        <aside className="hidden min-h-screen w-64 bg-neutral-900 p-6 md:block">

          <h1 className="text-2xl font-bold text-yellow-500">
            MC Legacy
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            Company Portal
          </p>


          <nav className="mt-10 space-y-4">

            <div className="rounded-lg bg-yellow-500 px-4 py-3 text-black">
              Dashboard
            </div>

            <div className="px-4 py-3 text-gray-300">
              📄 Contracts
            </div>

            <div className="px-4 py-3 text-gray-300">
              💰 Invoices
            </div>

            <div className="px-4 py-3 text-gray-300">
              📁 Files
            </div>

            <div className="px-4 py-3 text-gray-300">
              🔔 Notifications
            </div>

            <div className="px-4 py-3 text-gray-300">
              📊 Activity Logs
            </div>

            <div className="px-4 py-3 text-gray-300">
              👥 Members
            </div>

          </nav>

        </aside>



        {/* Main Dashboard */}
        <section className="flex-1 p-8">


          <h2 className="text-4xl font-bold">
            Welcome to MC Legacy Portal
          </h2>


          <p className="mt-3 text-gray-400">
            Manage company documents, contracts, invoices and team activity.
          </p>



          {/* Cards */}

          <div className="mt-10 grid gap-6 md:grid-cols-3">


            <div className="rounded-xl bg-neutral-900 p-6">
              <h3 className="text-xl font-semibold">
                Contracts
              </h3>

              <p className="mt-3 text-gray-400">
                0 Active Contracts
              </p>
            </div>



            <div className="rounded-xl bg-neutral-900 p-6">

              <h3 className="text-xl font-semibold">
                Invoices
              </h3>

              <p className="mt-3 text-gray-400">
                0 Pending Payments
              </p>

            </div>



            <div className="rounded-xl bg-neutral-900 p-6">

              <h3 className="text-xl font-semibold">
                Files
              </h3>

              <p className="mt-3 text-gray-400">
                0 Uploaded Documents
              </p>

            </div>


          </div>



          {/* Recent Activity */}

          <div className="mt-10 rounded-xl bg-neutral-900 p-6">

            <h3 className="text-2xl font-semibold">
              Recent Activity
            </h3>


            <p className="mt-4 text-gray-400">
              No activity recorded yet.
            </p>

          </div>


        </section>

      </div>

    </main>
  );
}