import ModeratorNavbar from '@/components/moderatorNavbar';
import ModeratorSidebar from '@/components/moderatorSidebar';
import React from 'react';

const getSubmissions = async (token) => {
  try {
    const res = await fetch("http://wiki-server.giguild.com/api/user/word/list", {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch submissions");

    return res.json();
  } catch (error) {
    console.log(error);
    return [];
  }
};

const page = async ({ cookies }) => {
  const tokenCookie = cookies().get('token');
  const token = tokenCookie ? tokenCookie.value : null;

  if (!token) {
    return <p className="text-center mt-8 text-red-500">You must be logged in to view this page.</p>;
  }

  const submissions = await getSubmissions(token);

  return (
    <div>
      <ModeratorNavbar />
      <div className="flex">
        <ModeratorSidebar />
        <main className="flex-1 p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-secondary">Review Submissions</h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search words..."
                  className="w-full p-2 pl-10 border border-gray-300 rounded-lg"
                />
                <i data-feather="search" className="absolute left-3 top-2.5 text-gray-400"></i>
              </div>
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg">
                <i data-feather="filter"></i>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Word</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Language</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted By</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {submissions.map((word) => (
                    <tr key={word._id}>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{word.word}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{word.language}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{word.submittedBy}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(word.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button className="bg-green-100 text-green-800 px-3 py-1 rounded-md text-sm flex items-center gap-1">
                            <i data-feather="check" className="w-4 h-4"></i> Approve
                          </button>
                          <button className="bg-red-100 text-red-800 px-3 py-1 rounded-md text-sm flex items-center gap-1">
                            <i data-feather="x" className="w-4 h-4"></i> Reject
                          </button>
                          <a
                            href={`/moderator/review-detail/${word._id}`}
                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md text-sm flex items-center gap-1"
                          >
                            <i data-feather="edit" className="w-4 h-4"></i> Edit
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{submissions.length}</span> of{' '}
                <span className="font-medium">{submissions.length}</span> results
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 border rounded-md bg-white">Previous</button>
                <button className="px-3 py-1 border rounded-md bg-primary text-white">1</button>
                <button className="px-3 py-1 border rounded-md bg-white">2</button>
                <button className="px-3 py-1 border rounded-md bg-white">Next</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default page;
