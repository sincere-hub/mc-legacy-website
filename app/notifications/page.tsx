export default function NotificationsPage() {
  return (
    <main className="min-h-screen bg-neutral-950 p-8 text-white">

      <h1 className="text-4xl font-bold text-yellow-500">
        Notifications
      </h1>


      <p className="mt-3 text-gray-400">
        View important updates and member activity alerts.
      </p>



      <div className="mt-10 space-y-5">


        {/* Notification Card */}

        <div className="rounded-xl bg-neutral-900 p-6">

          <h2 className="text-xl font-semibold">
            No Notifications
          </h2>


          <p className="mt-3 text-gray-400">
            New uploads, downloads and system alerts will appear here.
          </p>

        </div>



      </div>



      {/* Notification Types */}

      <div className="mt-10 grid gap-6 md:grid-cols-3">


        <div className="rounded-xl bg-neutral-900 p-6">

          <h3 className="text-lg font-semibold">
            📁 Files
          </h3>

          <p className="mt-3 text-gray-400">
            Upload and download alerts.
          </p>

        </div>



        <div className="rounded-xl bg-neutral-900 p-6">

          <h3 className="text-lg font-semibold">
            📄 Contracts
          </h3>

          <p className="mt-3 text-gray-400">
            Contract updates and approvals.
          </p>

        </div>



        <div className="rounded-xl bg-neutral-900 p-6">

          <h3 className="text-lg font-semibold">
            💰 Invoices
          </h3>

          <p className="mt-3 text-gray-400">
            Payment and invoice alerts.
          </p>

        </div>


      </div>


    </main>
  );
}