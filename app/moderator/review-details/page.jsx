import ModeratorSidebar from '@/components/moderatorSidebar'
import React from 'react'

const page = () => {
  return (
    <div>
<ModeratorNavbar/>    
<div className="flex">
    <ModeratorSidebar/>
        <main className="flex-1 p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-secondary">Review Word</h1>
                <a href="/moderator/review.html" className="text-primary hover:underline flex items-center gap-2">
                    <i data-feather="arrow-left"></i> Back to Review </a>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-4 mb-6">
                    <div className="bg-primary bg-opacity-10 p-3 rounded-lg">
                        <i data-feather="alert-circle" className="text-primary"></i>
                    </div>
                    <div>
                        <h2 className="font-bold">Wahala</h2>
                        <p className="text-gray-500 text-sm">Pidgin English - Pending Review</p>
                    </div>
                </div>
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Word/Phrase</label>
                        <div className="p-3 bg-gray-50 rounded-lg">Wahala</div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Meaning</label>
                        <div className="p-3 bg-gray-50 rounded-lg">Trouble or problem</div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Example Usage</label>
                        <div className="p-3 bg-gray-50 rounded-lg">"No wahala" means "No problem"</div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Submitted By</label>
                        <div className="p-3 bg-gray-50 rounded-lg">user@example.com</div>
                    </div>
                    <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-medium mb-4">Review Actions</h3>
                        <div className="flex flex-wrap gap-4">
                            <button
                                className="bg-green-100 hover:bg-green-200 text-green-800 font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2">
                                <i data-feather="check"></i> Approve </button>
                            <button
                                className="bg-red-100 hover:bg-red-200 text-red-800 font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2">
                                <i data-feather="x"></i> Reject </button>
                            <button
                                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2">
                                <i data-feather="edit"></i> Edit </button>
                            <button
                                className="bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2">
                                <i data-feather="flag"></i> Flag </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
    <script src="../components/moderator-navbar.js"></script>
    <script src="../components/moderator-sidebar.js"></script>
    <script src="../script.js"></script>
    <script>feather.replace();</script>
    </div>
  )
}

export default page