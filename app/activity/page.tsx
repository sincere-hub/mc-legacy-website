export default function ActivityPage() {
  return (
    <main className="min-h-screen bg-neutral-950 p-8 text-white">

      <h1 className="text-4xl font-bold text-yellow-500">
        Activity Logs
      </h1>


      <p className="mt-3 text-gray-400">
        Monitor all member activity inside MC Legacy Portal.
      </p>



      <div className="mt-10 rounded-xl bg-neutral-900 p-6">


        <h2 className="text-2xl font-semibold">
          Recent Activity
        </h2>



        <div className="mt-6 overflow-hidden rounded-lg">


          <table className="w-full text-left">


            <thead className="bg-neutral-800">

              <tr>

                <th className="p-4">
                  User
                </th>


                <th className="p-4">
                  Action
                </th>


                <th className="p-4">
                  Details
                </th>


                <th className="p-4">
                  Time
                </th>


              </tr>

            </thead>



            <tbody>


              <tr className="border-t border-neutral-800">


                <td className="p-4 text-gray-400">
                  -
                </td>


                <td className="p-4 text-gray-400">
                  No activity
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



      {/* Login Monitoring */}


      <div className="mt-10 rounded-xl bg-neutral-900 p-6">


        <h2 className="text-2xl font-semibold">
          Login Monitoring
        </h2>


        <p className="mt-4 text-gray-400">
          Member login records will appear here.
        </p>


      </div>



    </main>
  );
}