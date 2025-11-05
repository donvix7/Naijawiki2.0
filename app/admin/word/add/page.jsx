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
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-secondary">Add New Word</h1>
                <a href="/admin/words.html" className="text-primary hover:underline flex items-center gap-2">
                    <i data-feather="arrow-left"></i> Back to Words </a>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
                <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Word/Phrase*</label>
                            <input type="text" required
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Language*</label>
                            <select required
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary">
                                <option value="">Select Language</option>
                                <option>Pidgin</option>
                                <option>Yoruba</option>
                                <option>Igbo</option>
                                <option>Hausa</option>
                                <option>Other</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Meaning*</label>
                        <textarea rows="3" required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Example Usage</label>
                        <textarea rows="2"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"></textarea>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary">
                                <option value="">Select Category</option>
                                <option>Slang</option>
                                <option>Proverb</option>
                                <option>Greeting</option>
                                <option>Food</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status*</label>
                            <select required
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary">
                                <option value="approved">Approved</option>
                                <option value="pending">Pending</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end gap-4 pt-6">
                        <button type="reset"
                            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg transition-colors">
                            Reset </button>
                        <button type="submit"
                            className="bg-primary hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2">
                            <i data-feather="save"></i> Save Word </button>
                    </div>
                </form>
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