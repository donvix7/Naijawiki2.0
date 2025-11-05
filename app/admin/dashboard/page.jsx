import AdminNavbar from '@/components/adminNavbar'
import AdminSideBar from '@/components/adminSideBar'
import React from 'react'

const page = () => {
  return (
    <div>
        <AdminNavbar/>
    <div className="flex">
        <AdminSideBar/>
        <main className="flex-1 p-8">
            <h1 className="text-3xl font-bold text-secondary mb-6">Admin Dashboard</h1>
{          //  <!-- Stats Cards -->
}            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-primary">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-gray-500">Pending Words</p>
                            <h3 className="text-3xl font-bold">142</h3>
                        </div>
                        <i data-feather="clock" className="text-primary text-2xl"></i>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-secondary">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-gray-500">Total Words</p>
                            <h3 className="text-3xl font-bold">3,214</h3>
                        </div>
                        <i data-feather="book" className="text-secondary text-2xl"></i>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-accent">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-gray-500">New Users</p>
                            <h3 className="text-3xl font-bold">28</h3>
                        </div>
                        <i data-feather="users" className="text-accent text-2xl"></i>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-gray-500">Approved Today</p>
                            <h3 className="text-3xl font-bold">19</h3>
                        </div>
                        <i data-feather="check-circle" className="text-green-500 text-2xl"></i>
                    </div>
                </div>
            </div>
{        //    <!-- Recent Activity -->
}            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Recent Activity</h2>
                    <a href="/admin/activity.html" className="text-primary hover:underline">View All</a>
                </div>
                <div className="space-y-4">
                    <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
                        <div className="bg-gray-100 p-2 rounded-full">
                            <i data-feather="plus-circle" className="text-primary"></i>
                        </div>
                        <div>
                            <p className="font-medium">New word submission</p>
                            <p className="text-gray-500 text-sm">"Gbese" by user@example.com</p>
                            <p className="text-gray-400 text-xs mt-1">10 minutes ago</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
                        <div className="bg-gray-100 p-2 rounded-full">
                            <i data-feather="user" className="text-secondary"></i>
                        </div>
                        <div>
                            <p className="font-medium">New user registration</p>
                            <p className="text-gray-500 text-sm">jane_doe registered</p>
                            <p className="text-gray-400 text-xs mt-1">1 hour ago</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
                        <div className="bg-gray-100 p-2 rounded-full">
                            <i data-feather="check" className="text-green-500"></i>
                        </div>
                        <div>
                            <p className="font-medium">Word approved</p>
                            <p className="text-gray-500 text-sm">"Oya" by moderator@example.com</p>
                            <p className="text-gray-400 text-xs mt-1">2 hours ago</p>
                        </div>
                    </div>
                </div>
            </div>
{          //  <!-- Recent Words -->
}            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Recent Word Submissions</h2>
                    <a href="/admin/words.html" className="text-primary hover:underline">View All</a>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Word</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Language
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap font-medium">Gbese</td>
                                <td className="px-6 py-4 whitespace-nowrap">Pidgin</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                        className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Pending</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">10 min ago</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <a href="/admin/words/edit.html"
                                        className="text-primary hover:underline mr-3">Review</a>
                                    <a href="#" className="text-red-500 hover:underline">Delete</a>
                                </td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap font-medium">Oya</td>
                                <td className="px-6 py-4 whitespace-nowrap">Yoruba</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                        className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Approved</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">2 hours ago</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <a href="/admin/words/edit.html" className="text-primary hover:underline mr-3">View</a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
{            //<!-- Quick Actions -->
}            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <a href="/admin/words/add.html"
                        className="bg-gray-50 hover:bg-gray-100 p-4 rounded-lg flex flex-col items-center text-center">
                        <div className="bg-primary bg-opacity-10 p-3 rounded-full mb-2">
                            <i data-feather="plus" className="text-primary"></i>
                        </div>
                        <span className="font-medium">Add Word</span>
                    </a>
                    <a href="/admin/users.html"
                        className="bg-gray-50 hover:bg-gray-100 p-4 rounded-lg flex flex-col items-center text-center">
                        <div className="bg-secondary bg-opacity-10 p-3 rounded-full mb-2">
                            <i data-feather="users" className="text-secondary"></i>
                        </div>
                        <span className="font-medium">Manage Users</span>
                    </a>
                    <a href="/admin/words.html?status=pending"
                        className="bg-gray-50 hover:bg-gray-100 p-4 rounded-lg flex flex-col items-center text-center">
                        <div className="bg-accent bg-opacity-10 p-3 rounded-full mb-2">
                            <i data-feather="alert-circle" className="text-accent"></i>
                        </div>
                        <span className="font-medium">Review Words</span>
                    </a>
                    <a href="/admin/settings.html"
                        className="bg-gray-50 hover:bg-gray-100 p-4 rounded-lg flex flex-col items-center text-center">
                        <div className="bg-green-500 bg-opacity-10 p-3 rounded-full mb-2">
                            <i data-feather="settings" className="text-green-500"></i>
                        </div>
                        <span className="font-medium">Settings</span>
                    </a>
                </div>
            </div>
{            //<!-- System Status -->
}            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">System Status</h2>
                    <span className="text-sm text-green-600 bg-green-100 px-3 py-1 rounded-full flex items-center gap-2">
                        <i data-feather="check-circle" className="w-4 h-4"></i> All systems operational </span>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-4">
                            <div className="bg-green-100 p-2 rounded-full">
                                <i data-feather="database" className="text-green-500"></i>
                            </div>
                            <div>
                                <h3 className="font-medium">Database</h3>
                                <p className="text-gray-500 text-sm">Connection stable, 42 active queries</p>
                            </div>
                        </div>
                        <span className="text-sm text-green-600">Operational</span>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-4">
                            <div className="bg-green-100 p-2 rounded-full">
                                <i data-feather="hard-drive" className="text-green-500"></i>
                            </div>
                            <div>
                                <h3 className="font-medium">Storage</h3>
                                <p className="text-gray-500 text-sm">14.2 GB used (32%)</p>
                            </div>
                        </div>
                        <span className="text-sm text-green-600">Operational</span>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-4">
                            <div className="bg-yellow-100 p-2 rounded-full">
                                <i data-feather="cpu" className="text-yellow-500"></i>
                            </div>
                            <div>
                                <h3 className="font-medium">Server Load</h3>
                                <p className="text-gray-500 text-sm">72% CPU usage (High)</p>
                            </div>
                        </div>
                        <span className="text-sm text-yellow-600">Warning</span>
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