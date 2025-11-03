import React from 'react'

const page = () => {
  return (
    <div>
         <custom-admin-navbar></custom-admin-navbar>
    <div className="flex">
        <custom-admin-sidebar></custom-admin-sidebar>
        <main className="flex-1 p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-secondary">Activity Log</h1>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <input type="text" placeholder="Search activities..."
                            className="w-full p-2 pl-10 border border-gray-300 rounded-lg"/>
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Target</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        <i data-feather="check" className="w-3 h-3 mr-1"></i> Approved </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">admin@example.com</td>
                                <td className="px-6 py-4 whitespace-nowrap">Word: "Wahala"</td>
                                <td className="px-6 py-4 whitespace-nowrap">2 minutes ago</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button className="text-primary hover:underline">View</button>
                                </td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        <i data-feather="edit" className="w-3 h-3 mr-1"></i> Edited </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">moderator@example.com</td>
                                <td className="px-6 py-4 whitespace-nowrap">User: jane_doe</td>
                                <td className="px-6 py-4 whitespace-nowrap">15 minutes ago</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button className="text-primary hover:underline">View</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="mt-6 flex justify-between items-center">
                    <div className="text-sm text-gray-500"> Showing <span className="font-medium">1</span> to <span
                            className="font-medium">10</span> of <span className="font-medium">342</span> entries </div>
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
    <script src="../../components/admin-navbar.js"></script>
    <script src="../../components/admin-sidebar.js"></script>
    <script src="../../script.js"></script>
    <script>feather.replace();</script>
    </div>
  )
}

export default page