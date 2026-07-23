export default function FilesPage() {
  return (
    <main className="min-h-screen bg-neutral-950 p-8 text-white">

      <h1 className="text-4xl font-bold text-yellow-500">
        File Management
      </h1>

      <p className="mt-3 text-gray-400">
        Upload, manage and monitor company documents.
      </p>


      <div className="mt-10 rounded-xl bg-neutral-900 p-6">


        <div className="flex items-center justify-between">

          <h2 className="text-2xl font-semibold">
            Company Files
          </h2>


          <button className="rounded-lg bg-yellow-500 px-6 py-3 font-semibold text-black">
            Upload File
          </button>


        </div>



        <div className="mt-8 overflow-hidden rounded-lg">


          <table className="w-full text-left">


            <thead className="bg-neutral-800">

              <tr>

                <th className="p-4">
                  File Name
                </th>


                <th className="p-4">
                  Uploaded By
                </th>


                <th className="p-4">
                  Date
                </th>


                <th className="p-4">
                  Actions
                </th>


              </tr>

            </thead>



            <tbody>


              <tr className="border-t border-neutral-800">


                <td className="p-4 text-gray-400">
                  No files uploaded
                </td>


                <td className="p-4 text-gray-400">
                  -
                </td>


                <td className="p-4 text-gray-400">
                  -
                </td>


                <td className="p-4">

                  <button className="text-yellow-500">
                    Download
                  </button>

                </td>


              </tr>


            </tbody>


          </table>


        </div>


      </div>



      {/* Activity Preview */}

      <div className="mt-10 rounded-xl bg-neutral-900 p-6">


        <h2 className="text-2xl font-semibold">
          File Activity
        </h2>


        <p className="mt-4 text-gray-400">
          No file activity recorded.
        </p>


      </div>



    </main>
  );
}