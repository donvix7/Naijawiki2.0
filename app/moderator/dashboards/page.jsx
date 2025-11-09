import ModeratorNavbar from '@/components/moderatorNavbar';
import ModeratorSidebar from '@/components/moderatorSidebar';
import React from 'react';
import cookie from 'cookie';

const getWords = async (token) => {
  try {
    const res = await fetch("http://wiki-server.giguild.com/api/user/word/list", {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch words");
    }

    return res.json();
  } catch (error) {
    console.log(error);
    return [];
  }
};

const page = async ({ cookies }) => {
  // Get token from cookie
  const tokenCookie = cookies().get('token');
  const token = tokenCookie ? tokenCookie.value : null;

  if (!token) {
    return <p className="text-center mt-8 text-red-500">You must be logged in to view this page.</p>;
  }

  const words = await getWords(token);

  return (
    <div>
      <ModeratorNavbar />
      <div className="flex">
        <ModeratorSidebar />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold text-secondary mb-6">Moderator Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-primary">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500">Pending Words</p>
                  <h3 className="text-3xl font-bold">{words.filter(w => !w.approved).length}</h3>
                </div>
                <i data-feather="clock" className="text-primary text-2xl"></i>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-secondary">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500">Words Reviewed</p>
                  <h3 className="text-3xl font-bold">{words.filter(w => w.approved).length}</h3>
                </div>
                <i data-feather="check-circle" className="text-secondary text-2xl"></i>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-accent">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500">Flagged Words</p>
                  <h3 className="text-3xl font-bold">{words.filter(w => w.flagged).length}</h3>
                </div>
                <i data-feather="flag" className="text-accent text-2xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Words Needing Review</h2>
              <a href="/moderator/review" className="text-primary hover:underline">View All</a>
            </div>

            <div className="space-y-4">
              {words.map(word => (
                <div key={word._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium">{word.word}</h3>
                    <p className="text-gray-500 text-sm">{word.language} - "{word.meaning}"</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-green-100 text-green-800 px-3 py-1 rounded-md text-sm flex items-center gap-1">
                      <i data-feather="check" className="w-4 h-4"></i> Approve
                    </button>
                    <button className="bg-red-100 text-red-800 px-3 py-1 rounded-md text-sm flex items-center gap-1">
                      <i data-feather="x" className="w-4 h-4"></i> Reject
                    </button>
                    <a href={`/moderator/review-detail/${word._id}`} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md text-sm flex items-center gap-1">
                      <i data-feather="edit" className="w-4 h-4"></i> Edit
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default page;
