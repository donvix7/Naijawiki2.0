import ModeratorNavbar from '@/components/moderatorNavbar';
import ModeratorSidebar from '@/components/moderatorSidebar';
import React from 'react';

// Fetch word details by ID
const getWord = async (id) => {
    const base_url = process.env.NEXT_PUBLIC__BASE_URL;
  
  try {
    const res = await fetch(`${base_url}/moderator/word/${id}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.NAIJAWIKI_TOKEN}`, // your auth token
      },
      cache: 'no-store',
    });

    if (!res.ok) throw new Error('Failed to fetch word details');
    return res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
};

const page = async ({ params }) => {
  // Assuming Next.js dynamic route: /moderator/review/[id]
  const wordId = params.id;
  const word = await getWord(wordId);

  if (!word) return <p className="p-8">Failed to load word details.</p>;

  const handleAction = async (action) => {
    try {
      const res = await fetch(`http://wiki-server.giguild.com/api/moderator/word/${wordId}/${action}`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.NAIJAWIKI_TOKEN}`,
        },
      });
      if (!res.ok) throw new Error('Action failed');
      alert(`Word ${action} successfully!`);
    } catch (err) {
      console.error(err);
      alert('Failed to perform action');
    }
  };

  return (
    <div>
      <ModeratorNavbar />
      <div className="flex">
        <ModeratorSidebar />
        <main className="flex-1 p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-secondary">Review Word</h1>
            <a href="/moderator/review" className="text-primary hover:underline flex items-center gap-2">
              <i data-feather="arrow-left"></i> Back to Review
            </a>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-primary bg-opacity-10 p-3 rounded-lg">
                <i data-feather="alert-circle" className="text-primary"></i>
              </div>
              <div>
                <h2 className="font-bold">{word.word}</h2>
                <p className="text-gray-500 text-sm">{word.language} - {word.status}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Word/Phrase</label>
                <div className="p-3 bg-gray-50 rounded-lg">{word.word}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meaning</label>
                <div className="p-3 bg-gray-50 rounded-lg">{word.meaning}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Example Usage</label>
                <div className="p-3 bg-gray-50 rounded-lg">{word.example}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Submitted By</label>
                <div className="p-3 bg-gray-50 rounded-lg">{word.submittedBy}</div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium mb-4">Review Actions</h3>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => handleAction('approve')}
                    className="bg-green-100 hover:bg-green-200 text-green-800 font-bold py-3 px-6 rounded-lg flex items-center gap-2">
                    <i data-feather="check"></i> Approve
                  </button>
                  <button
                    onClick={() => handleAction('reject')}
                    className="bg-red-100 hover:bg-red-200 text-red-800 font-bold py-3 px-6 rounded-lg flex items-center gap-2">
                    <i data-feather="x"></i> Reject
                  </button>
                  <a
                    href={`/moderator/review-detail/${wordId}`}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg flex items-center gap-2">
                    <i data-feather="edit"></i> Edit
                  </a>
                  <button
                    onClick={() => handleAction('flag')}
                    className="bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold py-3 px-6 rounded-lg flex items-center gap-2">
                    <i data-feather="flag"></i> Flag
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default page;
