import AdminNavbar from '@/components/adminNavbar'
import AdminSidebar from '@/components/adminSideBar'
import React from 'react'

const getWords = async () => {
     try {
       const res = await fetch("http://wiki-server.giguild.com/api/words");
        console.log(res);
        if (!res.ok) {
            throw new Error("Network response was not ok")
        }
        return res.json();
    } catch (error) {
        console.log(error)

    }  
}
const page = async () => {
    const words = await getWords();

  return (
    <div>
        <AdminNavbar/>
    <div className="flex">
    <AdminSidebar/>
        <main className="flex-1 p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-secondary">Manage Words</h1>
                <a href="/admin/words/add.html"
                    className="bg-primary hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2">
                    <i data-feather="plus"></i> Add Word </a>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                        <select className="w-full p-2 border border-gray-300 rounded-lg">
                            <option value="">All Languages</option>
                            <option>Pidgin</option>
                            <option>Yoruba</option>
                            <option>Igbo</option>
                            <option>Hausa</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select className="w-full p-2 border border-gray-300 rounded-lg">
                            <option value="">All Statuses</option>
                            <option>Pending</option>
                            <option>Approved</option>
                            <option>Rejected</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                        <div className="relative">
                            <input type="text" placeholder="Search words..."
                                className="w-full p-2 pl-10 border border-gray-300 rounded-lg" />
                            <i data-feather="search" className="absolute left-3 top-2.5 text-gray-400"></i>
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Word</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Language
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted By
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap font-medium">Wahala</td>
                                <td className="px-6 py-4 whitespace-nowrap">Pidgin</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                        className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Approved</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">user@example.com</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <a href="/admin/words/edit.html" className="text-primary hover:underline mr-3">Edit</a>
                                    <a href="#" className="text-red-500 hover:underline">Delete</a>
                                </td>
                            </tr>

                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap font-medium">Omo</td>
                                <td className="px-6 py-4 whitespace-nowrap">Yoruba</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                        className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Pending</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">contributor@example.com</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <a href="/admin/words/edit.html"
                                        className="text-primary hover:underline mr-3">Review</a>
                                    <a href="#" className="text-red-500 hover:underline">Delete</a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="mt-6 flex justify-between items-center">
                    <div className="text-sm text-gray-500"> Showing <span className="font-medium">1</span> to <span
                            className="font-medium">10</span> of <span className="font-medium">124</span> results </div>
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
  )
}

export default page