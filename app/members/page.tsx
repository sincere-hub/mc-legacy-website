export default function MembersPage() {
  return (
    <main className="min-h-screen bg-neutral-950 p-8 text-white">

      <h1 className="text-4xl font-bold text-yellow-500">
        Members
      </h1>


      <p className="mt-3 text-gray-400">
        Manage MC Legacy company users and access levels.
      </p>



      <div className="mt-10 rounded-xl bg-neutral-900 p-6">


        <div className="flex items-center justify-between">

          <h2 className="text-2xl font-semibold">
            Company Members
          </h2>


          <button className="rounded-lg bg-yellow-500 px-6 py-3 font-semibold text-black">
            Add Member
          </button>


        </div>



        <div className="mt-8 overflow-hidden rounded-lg">


          <table className="w-full text-left">


            <thead className="bg-neutral-800">

              <tr>

                <th className="p-4">
                  Name
                </th>


                <th className="p-4">
                  Email
                </th>


                <th className="p-4">
                  Role
                </th>


                <th className="p-4">
                  Status
                </th>


              </tr>

            </thead>



            <tbody>


              <tr className="border-t border-neutral-800">


                <td className="p-4 text-gray-400">
                  No members added
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



      {/* Permission Overview */}

      <div className="mt-10 grid gap-6 md:grid-cols-3">


        <div className="rounded-xl bg-neutral-900 p-6">

          <h3 className="text-xl font-semibold">
            Admin
          </h3>

          <p className="mt-3 text-gray-400">
            Full system access.
          </p>

        </div>



        <div className="rounded-xl bg-neutral-900 p-6">

          <h3 className="text-xl font-semibold">
            Manager
          </h3>

          <p className="mt-3 text-gray-400">
            Manage company operations.
          </p>

        </div>



        <div className="rounded-xl bg-neutral-900 p-6">

          <h3 className="text-xl font-semibold">
            Staff
          </h3>

          <p className="mt-3 text-gray-400">
            Limited access.
          </p>

        </div>


      </div>


    </main>
  );
}