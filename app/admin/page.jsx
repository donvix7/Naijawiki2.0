
"use client"
import AdminNavbar from '@/components/adminNavbar'
import AdminSidebar from '@/components/adminSideBar';
import React from 'react'


const getWords = async () => {
     try {
       const res = await fetch("http://wiki-server.giguild.com/api/user/word/list");

        if (!res.ok) {
            throw new Error("Network response was not ok")
        }
        return res.josn();
    } catch (error) {
        console.log(error)

    }  
}
const page = async () => {

   
    return (
    <div>
    <AdminNavbar/>
<div className="flex">
    <AdminSidebar/>
        <main className="flex-1 p-8">
            <h1 className="text-3xl font-bold text-secondary mb-6">Admin Dashboard</h1>
{         //   <!-- Stats Cards -->
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
{     //       <!-- Recent Activity -->
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
                </div>
            </div>
        </main>
    </div>
    <script src="../components/admin-navbar.js"></script>
    <script src="../components/admin-sidebar.js"></script>
    <script src="../script.js"></script>
    <script>feather.replace();</script>
    </div>
  )
}

export default page